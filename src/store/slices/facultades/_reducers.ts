import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.cleanStore, (state) => ({
        ...state,
        ...INIT,
    }));
    addCase(Action.cleanFacultad, (state) => ({
        ...state,
        facultad: INIT.facultad,
    }));
    addCase(Fetcher.getFacultadesBy.fulfilled, (state, { payload }) => ({
        ...state,
        facultades: JSON.parse(JSON.stringify(payload.facultades)),
        error: payload.error
    }));
    addCase(Fetcher.getFacultades.fulfilled, (state, { payload }) => ({
        ...state,
        facultades: JSON.parse(JSON.stringify(payload.facultades)),
        error: payload.error
    }))
});
