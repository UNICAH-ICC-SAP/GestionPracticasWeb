import React from "react";
import { faFolderOpen, faFolderClosed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardTitle, Badge, CardSubtitle, CardText, CardFooter, ButtonGroup, Input } from "reactstrap";
import { ButtonPrimary } from "../buttons";
import type { Type as TypeUser } from "@store/slices/users/_namespace";
import { DEF, Props } from '@root/Api/typesProps';
import type { Type as TypeDocument } from "@store/slices/documentManager/_namespace";

type DocumentCardProps = {
    document: TypeDocument.DocumentInfo;
    user: TypeUser.User;
    onClick: () => void,
}

export default function UploadCard(prop: Props<DocumentCardProps, typeof DEF>) {
    const { document, onClick } = prop;
    const [file, setFile] = React.useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Check if files exist and get the first one
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
        console.log(e.target.files)
    };
    const handleUpload = async () => {
        if (!file) return;

        // Use FormData to send file to server
        const formData = new FormData();
        formData.append('file', file);
        const doc = await convertToBase64(file);
        console.log(doc)

        // try {
        //     const response = await fetch('YOUR_UPLOAD_URL', {
        //         method: 'POST',
        //         body: formData,
        //     });
        //     // Handle success
        // } catch (error) {
        //     // Handle error
        // }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result as string);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    return (<Card className="w-50" key={document.id} style={{ width: '20rem', marginBottom: '1rem' }}>
        <FontAwesomeIcon className="mt-2" size="6x" icon={document.status === 'pending' ? faFolderOpen : faFolderClosed} />
        <CardBody className="align-items-center">
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
                <Input className="mt-md-4 mb-md-2 mb-5" type="file" accept=".pdf" onChange={handleFileChange} />
                <ButtonGroup>
                    <ButtonPrimary onClick={() => {
                        handleUpload();
                        onClick();
                    }}>Upload</ButtonPrimary>
                </ButtonGroup>
            </CardFooter>
        </CardBody>
    </Card>)
}