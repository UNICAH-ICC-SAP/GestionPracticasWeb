import { CreateSelector } from "@root/storeConfig";
import type { StoreState } from "@store/index";
import type { StoreDocumentManager } from "./_namespace";
import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreDocumentManager.State {
    return store[NAME];
}

Selector.getDocument = CreateSelector(Selector, (state) => state.document);
Selector.getDocuments = CreateSelector(Selector, (state) => state.documents);
Selector.getError = CreateSelector(Selector, (state) => state.error);
Selector.getSavedDocument = CreateSelector(Selector, (state) => state.isSavedState);

/**Selector: fetching is loading */
// Selector.fetching = CreateSelector(Selector, (state) => state.loading);

