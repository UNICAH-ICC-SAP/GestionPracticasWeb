import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StoreFacultad } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreFacultad.State {
    return store[NAME];
}

/**Selector: get accountDetails data */
Selector.getFacultad = CreateSelector(Selector, (state) => state.facultad);
Selector.getFacutades = CreateSelector(Selector, (state) => state.facultades)
Selector.getError = CreateSelector(Selector, (state) => state.facultad);
/**Selector: fetching is loading */
// Selector.fetching = CreateSelector(Selector, (state) => state.loading);

