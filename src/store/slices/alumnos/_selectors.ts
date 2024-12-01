import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StoreAlumnos } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreAlumnos.State {
    return store[NAME];
}

/**Selector: get accountDetails data */
Selector.getAlumno = CreateSelector(Selector, (state) => state.alumno);
Selector.getError = CreateSelector(Selector, (state) => state.error);
Selector.getAlumnos = CreateSelector(Selector, (state) => state.alumnos);
/**Selector: fetching is loading */
// Selector.fetching = CreateSelector(Selector, (state) => state.loading);