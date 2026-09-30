import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "@store/index";
import type { StoreHorario } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreHorario.State {
  return store[NAME];
}

Selector.getDisponibilidades = CreateSelector(Selector, (state) => state.disponibilidades);
Selector.getError = CreateSelector(Selector, (state) => state.error);
Selector.getIsUpdate = CreateSelector(Selector, (state) => state.update);
