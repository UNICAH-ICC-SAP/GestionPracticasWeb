import React from "react";
import { useDispatch, useSelector } from "@store/index";
import { faFolderOpen, faFolderClosed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardTitle, Badge, CardSubtitle, CardText, CardFooter, ButtonGroup, Input, Spinner } from "reactstrap";
import { ButtonPrimary, ButtonSecondary } from "../buttons";
import { Fetcher as FetcherFiles, Selector as SelectorFiles } from "@store/slices/documentManager";
import type { Type as TypeUser } from "@store/slices/users/_namespace";
import type { Type as TypeAlumno } from "@store/slices/alumnos/_namespace";
import type { Document } from "./type";
import { DEF, Props } from '@root/Api/typesProps';
import { DocumentStatus, DocumentUploadStatus } from "@root/abstracts";
import { Post, PatchData, uploadToGCP } from "@utilities/Utilities";
import Swal from "sweetalert2";

type DocumentCardProps = {
    document: Document;
    user: TypeUser.User;
    userInfo: TypeUser.UserInfo | TypeAlumno.AlumnoInfo;
    onClickBack: () => void;
};

export default function UploadCard(prop: Props<DocumentCardProps, typeof DEF>) {
    const { document, onClickBack, user, userInfo } = prop;
    const dispatch = useDispatch();
    const [file, setFile] = React.useState<File | null>(null);
    const [loadingFile, setUploadingFile] = React.useState(false);
    const uploadingRef = React.useRef(false);
    const isRequestedChangesByDocente = useSelector(SelectorFiles.getIsRequestedChangesByDocente);
    const alumno = useSelector(SelectorFiles.getSelectedAlumno);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleUpload = async () => {
        if (!file || uploadingRef.current) return;
        if (file.type !== 'application/pdf' || file.size <= 0 || file.size > 50 * 1024 * 1024) {
            await Swal.fire({ icon: 'error', title: 'Archivo no válido', text: 'Selecciona un PDF de hasta 50 MB.' });
            return;
        }
        uploadingRef.current = true;
        setUploadingFile(true);
        try {
            const userId = user.roleId === 2 ? alumno.alumnoId : user.userId;
            const response = await Post({
                url: document.archivoId ? '/files/update-signed-urls' : '/files/signed-urls',
                data: {
                    userId,
                    userName: user.roleId === 2 ? alumno.alumnoNombre : userInfo.nombre,
                    file: { fileName: file.name, size: file.size, contentType: file.type },
                    fileTypeId: document.fileTypeId,
                    customFileName: `${document.title.toLowerCase().replaceAll(' ', '_')}.pdf`,
                    ...(document.archivoId ? { archivoId: document.archivoId } : {}),
                },
            });
            if (response.error.code) throw new Error(response.error.message);
            const signed = response.singleData as { file: { archivoId: number; uploadUrl: string } };
            if (!await uploadToGCP(signed.file.uploadUrl, file)) throw new Error('No se pudo subir el archivo.');
            const confirmation = await PatchData({
                url: '/files/updateFileStatus',
                data: {
                    id: signed.file.archivoId,
                    status: DocumentUploadStatus.UPLOADED,
                    fileStatus: isRequestedChangesByDocente ? DocumentStatus.CHANGE_REQUESTED : DocumentStatus.DELIVERED,
                },
            });
            if (confirmation.error.code) throw new Error(confirmation.error.message);
            dispatch(FetcherFiles.getDocuments({ url: '/files/list', data: { userId } }));
            await Swal.fire({ title: 'Archivo guardado', text: 'El archivo se subió y fue verificado correctamente.', icon: 'success' });
            onClickBack();
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'No se pudo guardar el archivo', text: error instanceof Error ? error.message : 'Intenta nuevamente.' });
        } finally {
            uploadingRef.current = false;
            setUploadingFile(false);
        }
    };

    return (<Card className="w-50" style={{ width: '20rem', marginBottom: '1rem' }}>
        <FontAwesomeIcon className="mt-2" size="6x" icon={document.fileStatus === DocumentStatus.PENDING ? faFolderOpen : faFolderClosed} />
        <CardBody className="align-items-center">
            <CardTitle tag="h5">
                {document.title}&nbsp;
                {document.fileStatus === DocumentStatus.CHANGE_REQUESTED && <Badge style={{ width: '1rem', height: '1rem', display: 'inline-flex', borderRadius: '100%', }} className="p-0"
                    color="warning" title="Cambios Solicitados" />}
            </CardTitle>
            <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
            >
            </CardSubtitle>
            <CardText className="mb-md-4 mb-5" style={{ height: '2rem', fontSize: '0.875rem' }}>
                {document.description}
            </CardText>
            <CardFooter>
                <Input className="mt-md-4 mb-md-2 mb-5" type="file" accept=".pdf" onChange={handleFileChange} />
                <ButtonGroup>
                    <ButtonPrimary disabled={loadingFile || !file} onClick={() => {
                        handleUpload();
                    }}>Upload</ButtonPrimary>
                    <ButtonSecondary disabled={loadingFile} onClick={() => {
                        onClickBack();
                    }}>Regresar</ButtonSecondary>
                </ButtonGroup>
            </CardFooter>
        </CardBody>
        {loadingFile &&
            <div className="text-center my-5">
                <Spinner color="primary">
                    Loading...
                </Spinner>
            </div>
        }
    </Card>)
}