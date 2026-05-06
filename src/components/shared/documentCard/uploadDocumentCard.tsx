import React from "react";
import { faFolderOpen, faFolderClosed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardTitle, Badge, CardSubtitle, CardText, CardFooter, ButtonGroup, Input } from "reactstrap";
import { ButtonPrimary, ButtonSecondary } from "../buttons";
import type { Type as TypeUser } from "@store/slices/users/_namespace";
import { DEF, Props } from '@root/Api/typesProps';
import { DocumentStatus, DocumentUploadStatus } from "@root/abstracts"
import type { Document } from "./type"
import { Fetcher as FetcherFiles, Selector as SelectorFiles } from "@store/slices/documentManager"
import { useDispatch, useSelector } from "@store/index";
import { TypeUtilities } from "@utilities/TypeUtilities";

type DocumentCardProps = {
    document: Document;
    user: TypeUser.User;
    userInfo: TypeUser.UserInfo;
    onClick: () => void,
}

export default function UploadCard(prop: Props<DocumentCardProps, typeof DEF>) {
    const { document, onClick, user, userInfo } = prop;
    const dispatch = useDispatch()
    const [file, setFile] = React.useState<File | null>(null);
    const signedUrl = useSelector(SelectorFiles.getSignedUrl);
    const uploaded = useSelector(SelectorFiles.getSavedDocument)

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
            if (document.fileStatus === DocumentStatus.CHANGE_REQUESTED) {
                const utils: TypeUtilities = {
                    url: `/files/updateFileStatus`, data: {
                        id: document.id,
                        fileStatus: DocumentStatus.DELIVERED,
                        status: DocumentUploadStatus.UPLOADED,
                    }
                };
                dispatch(FetcherFiles.updateStatus(utils))
            } else {
                const utils: TypeUtilities = {
                    url: `/files/updateFileStatus`, data: {
                        id: document.id,
                        status: DocumentUploadStatus.UPLOADED,
                        fileStatus: DocumentStatus.DELIVERED,
                    }
                };
                dispatch(FetcherFiles.updateStatus(utils))
            }
            onClick();
        }
    }, [uploaded]);

    const handleUpload = async () => {
        if (!file) return;
        if (document.fileStatus === DocumentStatus.CHANGE_REQUESTED) {
            const utils: TypeUtilities = {
                url: "/files/update-signed-urls", data: {
                    userId: user.userId,
                    userName: userInfo.nombre,
                    file: {
                        file: file.name,
                        size: file.size,
                        contentType: file.type
                    },
                    fileTypeId: document.id,
                    customFileName: `${document.title.toLowerCase().replaceAll(' ', '_')}.pdf`,
                    archivoId: document.archivoId,
                }
            };
            dispatch(FetcherFiles.createUpdateSignedUrl(utils));
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
                    fileTypeId: document.id,
                    customFileName: `${document.title.toLowerCase().replaceAll(' ', '_')}.pdf`
                }
            };
            dispatch(FetcherFiles.createSignedUrl(utils));
        }
    };

    return (<Card className="w-50" key={document.id} style={{ width: '20rem', marginBottom: '1rem' }}>
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
            <CardText>
                <p className="mb-md-4 mb-5" style={{ height: '2rem', fontSize: '0.875rem' }}>{document.description}</p>
            </CardText>
            <CardFooter>
                <Input className="mt-md-4 mb-md-2 mb-5" type="file" accept=".pdf" onChange={handleFileChange} />
                <ButtonGroup>
                    <ButtonPrimary onClick={() => {
                        handleUpload();
                    }}>Upload</ButtonPrimary>
                    <ButtonSecondary onClick={() => {
                        onClick();
                    }}>Regresar</ButtonSecondary>
                </ButtonGroup>
            </CardFooter>
        </CardBody>
    </Card>)
}