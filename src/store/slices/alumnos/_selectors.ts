import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StoreAlumnos } from "./_namespace";
import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreAlumnos.State {
    return store[NAME];
}

Selector.getAlumno = CreateSelector(Selector, (state) => state.alumno);
Selector.getAlumnos = CreateSelector(Selector, (state) => state.alumnos)
Selector.getError = CreateSelector(Selector, (state) => state.error);
/**Selector: fetching is loading */
// Selector.fetching = CreateSelector(Selector, (state) => state.loading);

