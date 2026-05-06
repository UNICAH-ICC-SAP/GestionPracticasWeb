import { CreateSelector } from "@root/storeConfig";
import type { StoreState } from "@store/index";
import type { StoreDocumentManager } from "./_namespace";
import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreDocumentManager.State {
    return store[NAME];
}

Selector.getSavedDocument = CreateSelector(
    Selector,
    (state) => state.isSavedState
);

Selector.getError = CreateSelector(
    Selector,
    (state) => state.error
);

Selector.getDocuments = CreateSelector(
    Selector,
    (state) => state.userFilesData
);

// Selector.getDocument = CreateSelector(
//     Selector,
//     (state) => state.document
// );

// Selector.getUserFiles = CreateSelector(
//     Selector,
//     (state) => state.selectedUser
// );

// Selector.getSelectedFile = CreateSelector(
//     Selector,
//     (state) => state.selectedFile
// );

Selector.getSignedUrl = CreateSelector(
    Selector,
    (state) => state.signedFilesUpload
);

// Selector.getDocumentsWithFiles = CreateSelector(
//     Selector,
//     (state) => {
//         const files = state.selectedUser?.files ?? [];

//         return state.documents.map((doc) => {
//             const file = files.find(f => f.documentTypeId === doc.id);

//             return {
//                 ...doc,
//                 file: file?.fileUrl || "",
//                 status: file?.status || doc.status,
//                 archivoId: file?.archivoId
//             };
//         });
//     }
// );

Selector.getDownloadFile = CreateSelector(
    Selector,
    (state) => state.signedFilesDownload
);