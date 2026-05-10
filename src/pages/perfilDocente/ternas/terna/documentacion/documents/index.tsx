import React from "react";
import { Container } from "reactstrap";
import { Documents } from "./data";
import type { Document } from "@components/shared/documentCard/type";
import DocumentCard from "@components/shared/documentCard/documentCard";
import { Selector as userSelector } from "@store/slices/users";
import { Selector as fileSelector, Fetcher as FetcherFiles } from "@store/slices/documentManager"
import { useDispatch, useSelector } from "@store/index";
import UploadCard from "@components/shared/documentCard/uploadDocumentCard";
import { TypeUtilities } from "@utilities/TypeUtilities";
import { DocumentStatus } from "@root/abstracts";

export default function Documentos() {
    const dispatch = useDispatch();
    const [showCards, setShowCards] = React.useState(true);
    const [selectedDoc, setSelectedDoc] = React.useState<Document | null>()
    const [documentsArray, setDocumentosArray] = React.useState<Document[]>(null)
    const [updateFiles, setUpdateFiles] = React.useState(true)
    const userFiles = useSelector(fileSelector.getDocuments);
    const user = useSelector(userSelector.getUser);
    const userInfo = useSelector(userSelector.getUserInfo);
    const alumno = useSelector(fileSelector.getSelectedAlumno);

    React.useEffect(() => {
        if (updateFiles) {
            const utils: TypeUtilities = {
                url: "/files/list", data: {
                    userId: alumno.alumnoId
                }
            };
            dispatch(FetcherFiles.getDocuments(utils));
            setDocumentosArray(null);
            setUpdateFiles(false);
        }
    }, [updateFiles]);

    React.useEffect(() => {
        const documentsObjectValue = Object.values(Documents);
        setDocumentosArray(documentsObjectValue)
    }, [])

    React.useEffect(() => {
        if (userFiles !== null) {
            const fileMap = new Map(
                userFiles.files.map(f => [f.fileTypeId, f])
            );

            const mergedDocuments = Object.values(Documents).map(doc => {
                const file = fileMap.get(doc.fileTypeId);
                return {
                    ...doc,
                    fileStatus: file?.fileStatus ?? DocumentStatus.PENDING,
                    exampleDocument: file?.fileUrl ?? doc.exampleDocument,
                    archivoId: file?.archivoId ?? doc.archivoId
                };
            });
            setDocumentosArray(mergedDocuments);
        }
    }, [userFiles, selectedDoc]);

    return (
        <Container tag={'div'} fluid className='d-flex mt-2 flex-wrap gap-3 justify-content-center'>
            {documentsArray !== null && showCards && documentsArray.map((doc) => (
                <DocumentCard
                    key={doc.fileTypeId}
                    document={doc}
                    user={user}
                    onClickDeliverButton={() => {
                        setShowCards(false);
                        setSelectedDoc(doc);
                    }}
                />
            ))}
            {selectedDoc && <UploadCard document={selectedDoc} user={user} userInfo={userInfo} onClickBack={() => {
                setShowCards(true);
                setSelectedDoc(null);
                setUpdateFiles(true);
            }} />}
        </Container>
    );
}