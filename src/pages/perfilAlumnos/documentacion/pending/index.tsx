import React from "react";
import { Container } from "reactstrap";
import { Documents } from "../data";
import DocumentCard from "@components/shared/documentCard/documentCard";
import { Selector as userSelector } from "@store/slices/users";
import { useSelector } from "@store/index";
import { INIT } from "@store/slices/documentManager/_namespace";
import type { Type as TypeDocument } from "@store/slices/documentManager/_namespace";
import UploadCard from "@components/shared/documentCard/uploadDocumentCard";

export default function DocumentacionPendiente() {
    const DocumentPending = Documents.filter(doc => doc.status === 'pending');
    const userInfo = useSelector(userSelector.getUser);
    const [showCards, setShowCards] = React.useState(true);
    const [selectedDoc, setSelectedDoc] = React.useState<TypeDocument.DocumentInfo>(INIT.document)

    return (
        <Container tag={'div'} fluid className='d-flex flex-wrap gap-3 justify-content-center'>
            {showCards ? DocumentPending.map((doc) => (
                <DocumentCard key={doc.id} document={doc} user={userInfo} onClick={() => {
                    setShowCards(false);
                    setSelectedDoc(doc);
                }} />
            )) : <UploadCard document={selectedDoc} user={userInfo} onClick={() => {
                setShowCards(true);
            }} />}
        </Container>
    );
}