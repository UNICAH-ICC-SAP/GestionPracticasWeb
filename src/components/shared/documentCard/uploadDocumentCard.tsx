import React from "react";
import { useDispatch, useSelector } from "@store/index";
import { faFolderOpen, faFolderClosed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardTitle, Badge, CardSubtitle, CardText, CardFooter, ButtonGroup, Input, Spinner } from "reactstrap";
import { ButtonPrimary, ButtonSecondary } from "../buttons";
import { Fetcher as FetcherFiles, Selector as SelectorFiles } from "@store/slices/documentManager"
import type { Type as TypeUser } from "@store/slices/users/_namespace";
import type { Type as TypeAlumno } from "@store/slices/alumnos/_namespace";
import type { Document } from "./type"
import { DEF, Props } from '@root/Api/typesProps';
import { DocumentStatus, DocumentUploadStatus } from "@root/abstracts"
import { TypeUtilities } from "@utilities/TypeUtilities";
import Swal from "sweetalert2";

type DocumentCardProps = {
    document: Document;
    user: TypeUser.User;
    userInfo: TypeUser.UserInfo | TypeAlumno.AlumnoInfo;
    onClickBack: () => void,
}

export default function UploadCard(prop: Props<DocumentCardProps, typeof DEF>) {
    const { document, onClickBack, user, userInfo } = prop;
    const dispatch = useDispatch()
    const [file, setFile] = React.useState<File | null>(null);
    const [loadingFile, setUploadingFile] = React.useState(false);
    const signedUrl = useSelector(SelectorFiles.getSignedUrlToUpload);
    const uploaded = useSelector(SelectorFiles.getIsSavedDocument);
    const isRequestedChangesByDocente = useSelector(SelectorFiles.getIsRequestedChangesByDocente);
    const alumno = useSelector(SelectorFiles.getSelectedAlumno);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    React.useEffect(() => {
        if (signedUrl !== null) {
            const utils: TypeUtilities = { url: signedUrl.uploadUrl, data: file };
            dispatch(FetcherFiles.uploadDocument(utils));
        }
    }, [signedUrl]);

    React.useEffect(() => {
        if (uploaded) {
            if (isRequestedChangesByDocente && document.fileStatus == DocumentStatus.DELIVERED) {
                const utils: TypeUtilities = {
                    url: `/files/updateFileStatus`, data: {
                        id: signedUrl.archivoId,
                        status: DocumentUploadStatus.UPLOADED,
                        fileStatus: DocumentStatus.CHANGE_REQUESTED,
                    }
                };
                dispatch(FetcherFiles.updateStatus(utils))
            } else if (document.fileStatus === DocumentStatus.CHANGE_REQUESTED) {
                const utils: TypeUtilities = {
                    url: `/files/updateFileStatus`, data: {
                        id: signedUrl.archivoId,
                        status: DocumentUploadStatus.UPLOADED,
                        fileStatus: DocumentStatus.DELIVERED,
                    }
                };
                dispatch(FetcherFiles.updateStatus(utils))
            } else {
                if (user.roleId === 2) {
                    const utils: TypeUtilities = {
                        url: `/files/updateFileStatus`, data: {
                            id: signedUrl.archivoId,
                            status: DocumentUploadStatus.UPLOADED,
                            fileStatus: DocumentStatus.DELIVERED,
                        }
                    };
                    dispatch(FetcherFiles.updateStatus(utils))
                } else {
                    const utils: TypeUtilities = {
                        url: `/files/updateFileStatus`, data: {
                            id: signedUrl.archivoId,
                            status: DocumentUploadStatus.UPLOADED,
                            fileStatus: DocumentStatus.DELIVERED,
                        }
                    };
                    dispatch(FetcherFiles.updateStatus(utils))
                }
            }
            Swal.fire({
                title: "¡Éxito!",
                text: "Archivo subido con exito",
                icon: "success",
            });
            onClickBack();
        }
    }, [uploaded]);

    const handleUpload = async () => {
        if (!file) return;
        if (isRequestedChangesByDocente && document.fileStatus == DocumentStatus.DELIVERED) {
            const utils: TypeUtilities = {
                url: "/files/update-signed-urls", data: {
                    userId: alumno.alumnoId,
                    userName: alumno.alumnoNombre,
                    file: {
                        file: file.name,
                        size: file.size,
                        contentType: file.type
                    },
                    fileTypeId: document.fileTypeId,
                    customFileName: `${document.title.toLowerCase().replaceAll(' ', '_')}.pdf`,
                    archivoId: document.archivoId,
                }
            };
            dispatch(FetcherFiles.createUpdateSignedUrl(utils));
        } else if (document.fileStatus === DocumentStatus.CHANGE_REQUESTED) {
            const utils: TypeUtilities = {
                url: "/files/update-signed-urls", data: {
                    userId: user.userId,
                    userName: userInfo.nombre,
                    file: {
                        file: file.name,
                        size: file.size,
                        contentType: file.type
                    },
                    fileTypeId: document.fileTypeId,
                    customFileName: `${document.title.toLowerCase().replaceAll(' ', '_')}.pdf`,
                    archivoId: document.archivoId,
                }
            };
            dispatch(FetcherFiles.createUpdateSignedUrl(utils));
        } else {
            if (user.roleId === 2) {
                const utils: TypeUtilities = {
                    url: "/files/signed-urls", data: {
                        userId: alumno.alumnoId,
                        userName: alumno.alumnoNombre,
                        file: {
                            file: file.name,
                            size: file.size,
                            contentType: file.type
                        },
                        fileTypeId: document.fileTypeId,
                        customFileName: `${document.title.toLowerCase().replaceAll(' ', '_')}.pdf`
                    }
                };
                dispatch(FetcherFiles.createSignedUrl(utils));
            } else {
                const utils: TypeUtilities = {
                    url: "/files/signed-urls", data: {
                        userId: user.userId,
                        userName: userInfo.nombre,
                        file: {
                            file: file.name,
                            size: file.size,
                            contentType: file.type
                        },
                        fileTypeId: document.fileTypeId,
                        customFileName: `${document.title.toLowerCase().replaceAll(' ', '_')}.pdf`
                    }
                };
                dispatch(FetcherFiles.createSignedUrl(utils));
            }
        }
        setUploadingFile(true);
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
                    <ButtonPrimary onClick={() => {
                        handleUpload();
                    }}>Upload</ButtonPrimary>
                    <ButtonSecondary onClick={() => {
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