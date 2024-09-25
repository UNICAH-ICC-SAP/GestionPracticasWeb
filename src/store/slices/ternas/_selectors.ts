import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StoreUser } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreUser.State {
    return store[NAME];
}

/**Selector: get accountDetails data */
Selector.ternaInfo = CreateSelector(Selector, (state) => state.ternaInfo);
Selector.ternasInfo = CreateSelector(Selector, (state) => state.ternasInfo);
Selector.getStep1 = CreateSelector(Selector, (state) => state.step1);
Selector.getStep2 = CreateSelector(Selector, (state) => state.step2);
Selector.getResume = CreateSelector(Selector, (state) => state.resumen);
Selector.getAlumo = CreateSelector(Selector, (state) => state.ternaInfo.alumno);
Selector.getDetalleTernas = CreateSelector(Selector, (state) => state.ternaInfo.detalleTernas);

Selector.getError = CreateSelector(Selector, (state) => state.error);
/**Selector: fetching is loading */
// Selector.fetching = CreateSelector(Selector, (state) => state.loading);

