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
});
