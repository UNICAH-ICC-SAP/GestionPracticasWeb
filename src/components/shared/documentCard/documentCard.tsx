import React from "react";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faFolderClosed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardTitle, CardSubtitle, CardText, CardFooter, ButtonGroup, Button, Badge, CardDeck, CardHeader } from "reactstrap";
import { ButtonPrimary, ButtonSecondary } from "../buttons";
import { DEF, Props } from '@root/Api/typesProps';
import type { Type as TypeUser } from "@store/slices/users/_namespace";
import { DocumentStatus } from "@root/abstracts"
import type { Document } from "./type"

import { Fetcher as FetcherFiles, Selector as SelectorFiles, Action as ActionFiles } from "@store/slices/documentManager"
import { useDispatch, useSelector } from "@store/index";
import type { TypeUtilities } from "@utilities/TypeUtilities";
import { downloadFromGCP } from "@utilities/Utilities";

type DocumentCardProps = {
    document: Document;
    user: TypeUser.User;
    onClick: () => void;
}

export default function DocumentCard(prop: Props<DocumentCardProps, typeof DEF>) {
    const { document, user, onClick } = prop;
    const dispatch = useDispatch();
    const downloadFile = useSelector(SelectorFiles.getDownloadFile);
    const [donwload, setDownload] = React.useState(false);

    React.useEffect(() => {
        if (downloadFile !== null && donwload) {
            setDownload(false);
            dispatch(ActionFiles.cleanSignedFilesDownload())
            downloadFromGCP(downloadFile.downloadUrl, downloadFile.originalName);
        }
    }, [downloadFile]);

    return (<Card key={document.id} style={{ width: '20rem', marginBottom: '1rem' }}>
        <CardHeader className="d-flex justify-content-around align-items-center w-100" style={{ height: "4rem" }}>
            <CardTitle tag="h5">
                {document.title}
            </CardTitle>
            <CardDeck>
                {document.fileStatus === DocumentStatus.CHANGE_REQUESTED && <Badge style={{ width: '1rem', height: '1rem', display: 'inline-flex', borderRadius: '100%', }} color="warning" title="Cambios Solicitados" />}
                {document.fileStatus === DocumentStatus.DELIVERED && <Badge style={{ width: '1rem', height: '1rem', display: 'inline-flex', borderRadius: '100%', }} color="success" title="Entregado" />}
                {document.fileStatus === DocumentStatus.PENDING && <Badge style={{ width: '1rem', height: '1rem', display: 'inline-flex', borderRadius: '100%', }} color="danger" title="Pendiente" />}
            </CardDeck>
        </CardHeader>
        <CardBody>
            <FontAwesomeIcon className="mt-2" size="6x" icon={document.fileStatus === DocumentStatus.PENDING ? faFolderOpen : faFolderClosed} />
            <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
            >
            </CardSubtitle>
            <CardText>{document.description}</CardText>
        </CardBody>
        <CardFooter style={{ height: "4rem" }}>
            {document.fileStatus === DocumentStatus.PENDING ? <ButtonGroup>
                <Button color="success" href="./" onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}>
                    Entregar
                </Button>
                <ButtonSecondary href={document.exampleDocument} target="_blank" rel="noopener noreferrer">
                    Ver ejemplo
                </ButtonSecondary>
            </ButtonGroup> :
                <ButtonGroup>
                    {user.roleId === 3 && document.fileStatus === DocumentStatus.CHANGE_REQUESTED ? <ButtonSecondary href="./" onClick={(e) => {
                        e.preventDefault();
                        onClick();
                    }} rel="noopener noreferrer">
                        Actualizar
                    </ButtonSecondary> : user.roleId === 1 ? <ButtonSecondary href={document.exampleDocument} target="_blank" rel="noopener noreferrer">
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
                        Visualizar
                    </ButtonPrimary>
                </ButtonGroup>
            }
        </CardFooter>
    </Card>);
}