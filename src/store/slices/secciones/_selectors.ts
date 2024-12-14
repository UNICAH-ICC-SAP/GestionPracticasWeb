import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StoreSeccion } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreSeccion.State {
  return store[NAME];
}

Selector.getSecciones = CreateSelector(Selector, (state) => state.secciones);
Selector.getError = CreateSelector(Selector, (state) => state.error);
