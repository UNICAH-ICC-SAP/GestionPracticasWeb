import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";
import { add } from "lodash";

export default CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.cleanStore, (state) => ({
        ...state,
        ...INIT,
    }));
    addCase(Action.cleanAlumno, (state) => ({
        ...state,
        facultad: INIT.alumno,
    }));   
    addCase(Fetcher.getAlumnos.fulfilled, (state, { payload }) => ({
        ...state,
        alumnos: JSON.parse(JSON.stringify(payload.alumnos))
    }))
    addCase(Fetcher.updatealumno.fulfilled, (state, { payload }) => ({
        ...state,
        alumnosActualizado: JSON.parse(JSON.stringify(payload.alumnos)),
        error: JSON.parse(JSON.stringify(payload.error))
    }))
    addCase(Fetcher.deletealumno.fulfilled, (state, { payload }) => ({
        ...state,
        alumnosEliminado: JSON.parse(JSON.stringify(payload.alumnos)),
        error: JSON.parse(JSON.stringify(payload.error))
    }))
});
