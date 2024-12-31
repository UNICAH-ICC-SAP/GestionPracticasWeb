import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.cleanStore, (state) => ({ ...state, ...INIT }));

    addCase(Fetcher.insertNuevaCarga.fulfilled, (state, { payload }) => ({
        ...state,
        nuevaCarga: JSON.parse(JSON.stringify(payload.nuevoPeriodo)),
        error: JSON.parse(JSON.stringify(payload.error)),
    }));
    addCase(Fetcher.getPeriodos.fulfilled, (state, { payload }) => ({
        ...state,
        periodos: JSON.parse(JSON.stringify(payload.periodos)),
        error: JSON.parse(JSON.stringify(payload.error)),
    }));
});
