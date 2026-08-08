import React from "react";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faFolderClosed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardTitle, CardSubtitle, CardText, CardFooter, ButtonGroup, Button, Badge, CardDeck, CardHeader } from "reactstrap";
import { ButtonPrimary, ButtonSecondary, ButtonWarning } from "@components/shared/buttons";
import { DEF, Props } from '@root/Api/typesProps';
import type { Type as TypeUser } from "@store/slices/users/_namespace";
import { DocumentStatus, DocumentUploadStatus, DocumentTypeAlumnos } from "@root/abstracts"
import type { Document } from "./type"
import { Fetcher as FetcherFiles, Selector as SelectorFiles, Action as ActionFiles } from "@store/slices/documentManager"
import { useDispatch, useSelector } from "@store/index";
import type { TypeUtilities } from "@utilities/TypeUtilities";
import { downloadFromGCP } from "@utilities/Utilities";
import Swal from "sweetalert2";

type DocumentCardProps = {
    document: Document;
    user: TypeUser.User;
    onClickDeliverButton: () => void;
    onViewMonografia?: () => void;
}

export default function DocumentCard(prop: Props<DocumentCardProps, typeof DEF>) {
    const { document, user, onClickDeliverButton, onViewMonografia } = prop;
    const dispatch = useDispatch();
    const [donwload, setDownload] = React.useState(false);
    const downloadFile = useSelector(SelectorFiles.getSignedUrlToDownload);
    const isRequestedChangesByDocente = useSelector(SelectorFiles.getIsRequestedChangesByDocente)

    React.useEffect(() => {
        if (downloadFile !== null && donwload) {
            setDownload(false);
            dispatch(ActionFiles.cleanSignedFilesDownload())
            downloadFromGCP(downloadFile.downloadUrl, downloadFile.originalName);
        }
    }, [downloadFile]);

    const handleViewMonografia = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onViewMonografia) {
            onViewMonografia();
        } else if (document.exampleDocument) {
            window.open(document.exampleDocument, "_blank");
        }
    };

    return (<Card style={{ width: '20rem', marginBottom: '1rem' }}>
        <CardHeader className="d-flex justify-content-around align-items-center w-100" style={{ height: "4rem" }}>
            <CardTitle tag="h5">
                {document.title}
            </CardTitle>
            <CardDeck>
                {document.fileStatus === DocumentStatus.CHANGE_REQUESTED && (
                    <Badge color="warning" className="d-inline-flex align-items-center gap-1 px-2 py-1" pill>
                        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block' }} />
                        <span style={{ fontSize: '0.7rem' }}>Cambios Solicitados</span>
                    </Badge>
                )}
                {document.fileStatus === DocumentStatus.DELIVERED && (
                    <Badge color="success" className="d-inline-flex align-items-center gap-1 px-2 py-1" pill>
                        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block' }} />
                        <span style={{ fontSize: '0.7rem' }}>Entregado</span>
                    </Badge>
                )}
                {document.fileStatus === DocumentStatus.PENDING && (
                    <Badge color="danger" className="d-inline-flex align-items-center gap-1 px-2 py-1" pill>
                        <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#fff', display: 'inline-block' }} />
                        <span style={{ fontSize: '0.7rem' }}>Pendiente</span>
                    </Badge>
                )}
            </CardDeck>
        </CardHeader>
        <CardBody>
            <FontAwesomeIcon className="mt-2" size="6x" icon={document.fileStatus === DocumentStatus.PENDING || document.fileStatus === DocumentStatus.CHANGE_REQUESTED ? faFolderOpen : faFolderClosed} />
            <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
            >
            </CardSubtitle>
            <CardText>{document.description}</CardText>
        </CardBody>
        <CardFooter style={{ height: "4rem" }} className="d-flex justify-content-center align-items-center">
            {(document.fileStatus === DocumentStatus.PENDING || document.fileStatus === DocumentStatus.CHANGE_REQUESTED) ? (
                document.fileTypeId === DocumentTypeAlumnos.MONOGRAFIA ? (
                    <ButtonSecondary onClick={handleViewMonografia}>
                        Ver monografía
                    </ButtonSecondary>
                ) : (
                    <ButtonGroup>
                        <Button color="success" href="./" onClick={(e) => {
                            e.preventDefault();
                            onClickDeliverButton();
                        }}>
                            Entregar
                        </Button>
                        {[7, 8].includes(document.fileTypeId) && user.roleId !== 3 ?
                            <ButtonSecondary href="./" target="_blank" rel="noopener noreferrer" onClick={(e) => {
                                e.preventDefault();
                                const utils: TypeUtilities = {
                                    url: "/files/download-url", data: {
                                        archivoId: document.fileTypeId === 7 ? 1 : 2
                                    }
                                };
                                dispatch(FetcherFiles.getDownloadSignedUrl(utils));
                                setDownload(true);
                            }}>
                                Descargar Plantilla
                            </ButtonSecondary> : [1, 2, 3, 4, 5].includes(document.fileTypeId) ?
                                <ButtonSecondary href={document.exampleDocument} target="_blank" rel="noopener noreferrer">
                                    Ver ejemplo
                                </ButtonSecondary> : null
                        }
                    </ButtonGroup>
                )
            ) :
                <ButtonGroup>
                    {user.roleId === 1 ? <ButtonSecondary href={document.exampleDocument} target="_blank" rel="noopener noreferrer">
                        Solicitar Cambios
                    </ButtonSecondary> : null}
                    <ButtonPrimary href="./" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        e.preventDefault();
                        const utils: TypeUtilities = {
                            url: "/files/download-url", data: {
                                archivoId: document?.archivoId
                            }
                        };
                        dispatch(FetcherFiles.getDownloadSignedUrl(utils));
                        setDownload(true);
                    }}>
                        Descargar
                    </ButtonPrimary>
                    {isRequestedChangesByDocente && document.fileStatus === DocumentStatus.DELIVERED && <ButtonWarning onClick={(e) => {
                        e.preventDefault();
                        Swal.fire({
                            title: "Solicitud de Cambios",
                            text: "Para proceder tiene dos opciones, por favor elija una.",
                            icon: "warning",
                            confirmButtonText: "Subir Documento",
                            cancelButtonText: "Solicitar cambios",
                            showCancelButton: true,
                            showConfirmButton: true,
                        }).then(result => {
                            if (result.isConfirmed) {
                                onClickDeliverButton();
                            }
                            if (result.isDismissed) {
                                const utils: TypeUtilities = {
                                    url: `/files/updateFileStatus`, data: {
                                        id: document.archivoId,
                                        status: DocumentUploadStatus.UPLOADED,
                                        fileStatus: DocumentStatus.CHANGE_REQUESTED,
                                    }
                                };
                                dispatch(FetcherFiles.updateStatus(utils))
                            }
                        });
                    }}>
                        Solicitar Cambios</ButtonWarning>}
                </ButtonGroup>
            }
        </CardFooter>
    </Card>);
}