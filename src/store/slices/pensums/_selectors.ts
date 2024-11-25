import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StorePensum } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StorePensum.State {
  return store[NAME];
}

Selector.getClases = CreateSelector(Selector, (state) => state.clases);
Selector.getCarreras = CreateSelector(Selector, (state) => state.carreras);
Selector.getError = CreateSelector(Selector, (state) => state.error);
