import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.cleanStore, (state) => ({ ...state, ...INIT }));
    addCase(Action.cleanUserData, (state) => ({
        ...state,
    }));
    addCase(Fetcher.getDocentes.fulfilled, (state, { payload }) => ({
        ...state,
        docentes: JSON.parse(JSON.stringify(payload.docentes)),
        error: JSON.parse(JSON.stringify(payload.error)),
    }));
    addCase(Fetcher.updateDocente.fulfilled, (state, { payload }) => ({
        ...state,
        docenteActualizado: JSON.parse(JSON.stringify(payload.docente)),
        error: JSON.parse(JSON.stringify(payload.error),)
    }));
    addCase(Fetcher.insertDocente.fulfilled, (state, { payload }) => ({
        ...state,
        docenteAgregado: JSON.parse(JSON.stringify(payload.docente)),
        error: JSON.parse(JSON.stringify(payload.error),)
    }));
    addCase(Fetcher.insertUserDocente.fulfilled, (state, { payload }) => ({
        ...state,
        docenteUserCreated: JSON.parse(JSON.stringify(payload.docenteUserCreated)),
        error: JSON.parse(JSON.stringify(payload.error),)
    }));
});
