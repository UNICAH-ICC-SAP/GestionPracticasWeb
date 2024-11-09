import { CreateSelector } from "../../../storeConfig";
import type { StoreState} from "../..";
import type { StorePensum } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StorePensum.State {
  return store[NAME];
}

Selector.getPensum = CreateSelector(Selector, (state) => state.pensum);
Selector.getCarrera = CreateSelector(Selector, (state) => state.carrera);
Selector.getError = CreateSelector(Selector, (state) => state.error);

