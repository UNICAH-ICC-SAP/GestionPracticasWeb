import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StorePlantillas } from "./_namespace";
import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StorePlantillas.State {
    return store[NAME];
}

Selector.getPlantilla = CreateSelector(Selector, (state) => state.plantilla);
Selector.getPlantillas = CreateSelector(Selector, (state) => state.plantillas)
Selector.getError = CreateSelector(Selector, (state) => state.error);
Selector.getSavedPlantilla = CreateSelector(Selector, (state) => state.isSavedPlantillaState);

/**Selector: fetching is loading */
// Selector.fetching = CreateSelector(Selector, (state) => state.loading);

