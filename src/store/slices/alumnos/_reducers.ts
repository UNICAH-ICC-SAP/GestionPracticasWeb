import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
   
    addCase(Action.cleanStore, (state) => ({
        ...state,
        ...INIT,
    }));
    addCase(Action.cleanAlumno, (state) => ({
        ...state,
        alumno: INIT.alumno,
    }));
    addCase(Fetcher.getAlumnos.fulfilled, (state, { payload }) => ({
        ...state,
        alumnos: JSON.parse(JSON.stringify(payload.alumnos)), 
    }));
    addCase(Fetcher.saveDataAlumno.fulfilled, (state, { payload}) => ({
        ...state,
        saveDataAlumno: JSON.parse(JSON.stringify(payload))
    }));
    addCase(Fetcher.updatealumno.fulfilled, (state, { payload }) => ({
        ...state,
        alumnosActualizado: JSON.parse(JSON.stringify(payload.alumnos)),
        error: JSON.parse(JSON.stringify(payload.error))
    }));

});
