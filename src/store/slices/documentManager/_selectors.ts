import { CreateSelector } from "@root/storeConfig";
import type { StoreState } from "@store/index";
import type { StoreDocumentManager } from "./_namespace";
import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreDocumentManager.State {
    return store[NAME];
}

Selector.getIsSavedDocument = CreateSelector(
    Selector,
    (state) => state.isSavedState
);

Selector.getIsUpdated = CreateSelector(
    Selector,
    (state) => state.isUpdatedStates
);

Selector.getError = CreateSelector(
    Selector,
    (state) => state.error
);

Selector.getDocuments = CreateSelector(
    Selector,
    (state) => state.userFilesData
);

Selector.getSignedUrlToUpload = CreateSelector(
    Selector,
    (state) => state.signedFilesUpload
);

Selector.getSignedUrlToDownload = CreateSelector(
    Selector,
    (state) => state.signedFilesDownload
);

Selector.getIsRequestedChangesByDocente = CreateSelector(Selector,
    (state) => state.isRequestedChangesByDocente
)