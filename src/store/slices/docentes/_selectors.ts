import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StoreUser } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreUser.State {
    return store[NAME];
}

/**Selector: get accountDetails data */
Selector.getDocentes = CreateSelector(Selector, (state) => state.docentes);

Selector.getError = CreateSelector(Selector, (state) => state.error);

Selector.getDocenteUserCreated = CreateSelector(Selector, (state) => state.docenteUserCreated);
/**Selector: fetching is loading */
// Selector.fetching = CreateSelector(Selector, (state) => state.loading);

