import React from "react";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faFolderClosed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardTitle, CardSubtitle, CardText, CardFooter, ButtonGroup, Button, Badge } from "reactstrap";
import { ButtonPrimary, ButtonSecondary } from "../buttons";
import { DEF, Props } from '@root/Api/typesProps';
import type { Type as TypeDocument } from "@store/slices/documentManager/_namespace";
import type { Type as TypeUser } from "@store/slices/users/_namespace";

type DocumentCardProps = {
    document: TypeDocument.DocumentInfo;
    user: TypeUser.User;
    onClick: () => void,
}

export default function DocumentCard(prop: Props<DocumentCardProps, typeof DEF>) {
    const { document, user, onClick } = prop;
    console.log(prop)
    const base64ToFile = (base64String: string, fileName: string): File => {
        const [header, data] = base64String.split(',');
        const mimeMatch = header.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

        const byteString = atob(data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new File([ab], fileName, { type: mime });
    };
    return (<Card key={document.id} style={{ width: '20rem', marginBottom: '1rem' }}>
        <FontAwesomeIcon className="mt-2" size="6x" icon={document.status === 'pending' ? faFolderOpen : faFolderClosed} />
        <CardBody>
            <CardTitle tag="h5">
                {document.title}&nbsp;
                {document.status === 'change_requested' && <Badge style={{ width: '1rem', height: '1rem', display: 'inline-flex', borderRadius: '100%', }} className="p-0"
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
                {document.status === 'pending' ? <ButtonGroup>
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
                        {user.roleId === 3 && document.status === 'change_requested' ? <ButtonSecondary href={document.file} target="_blank" rel="noopener noreferrer">
                            Actualizar
                        </ButtonSecondary> : user.roleId === 1 ? <ButtonSecondary href={document.file} target="_blank" rel="noopener noreferrer">
                            Solicitar Cambios
                        </ButtonSecondary> : null}
                        <ButtonPrimary href="./" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                            e.preventDefault();
                            const file = base64ToFile(document.file, document.title);
                            console.log(file)
                        }} rel="noopener noreferrer">
                            Visualizar
                        </ButtonPrimary>
                    </ButtonGroup>
                }
            </CardFooter>
        </CardBody>
    </Card>);
}