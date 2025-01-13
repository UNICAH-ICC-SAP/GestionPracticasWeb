import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StoreAccionPlantillas } from "./_namespace";
import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreAccionPlantillas.State {
    return store[NAME];
}

Selector.getAccionPlantilla = CreateSelector(Selector, (state) => state.accionPlantilla);
Selector.getAccionPlantillas = CreateSelector(Selector, (state) => state.accionPlantillas)
Selector.getError = CreateSelector(Selector, (state) => state.error);
Selector.getSavedUserState = CreateSelector(Selector, (state) => state.isSavedAccionPlantilla);
Selector.getSavedAccionPlantillaState = CreateSelector(Selector, (state) => state.isUpdatedAccion);

/**Selector: fetching is loading */
// Selector.fetching = CreateSelector(Selector, (state) => state.loading);

