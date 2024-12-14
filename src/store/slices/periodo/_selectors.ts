import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StorePeriodo } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StorePeriodo.State {
    return store[NAME];
}

Selector.getNuevoPeriodo = CreateSelector(Selector, (state) => state.nuevoPeriodo);

Selector.getError = CreateSelector(Selector, (state) => state.error);
