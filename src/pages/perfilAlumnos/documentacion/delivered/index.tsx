import React from "react";
import { Container } from "reactstrap";
import { Documents } from "../data";
import DocumentCard from "@components/shared/documentCard/documentCard";
import { Selector as userSelector } from "@store/slices/users";
import { useSelector } from "@store/index";

export default function DocumentacionEntregada() {
    const DocumentsDelivered = Documents.filter(doc => doc.status !== 'pending');
    const userInfo = useSelector(userSelector.getUser);
    return (
        <Container tag={'div'} fluid className='d-flex flex-wrap gap-3 justify-content-center'>
            {DocumentsDelivered.map((doc) => (
                <DocumentCard onClick={() => { }} key={doc.id} document={doc} user={userInfo} />
            ))}
        </Container>
    );
}