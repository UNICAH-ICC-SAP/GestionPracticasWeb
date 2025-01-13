import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {

    addCase(Action.cleanStore, (state) => ({
        ...state,
        ...INIT,
    }));
    addCase(Action.cleanAccion, (state) => ({
        ...state,
        accionPlantilla: INIT.accionPlantilla,
    }));
    addCase(Fetcher.getAcciontesPlantillas.fulfilled, (state, { payload }) => ({
        ...state,
        accionPlantillas: JSON.parse(JSON.stringify(payload.accionesPlantillas)),
    }));
    addCase(Fetcher.saveAccion.fulfilled, (state, { payload }) => ({
        ...state,
        isSavedUser: payload.isSavedUser
    }));
    addCase(Fetcher.updateAccion.fulfilled, (state, { payload }) => ({
        ...state,
        alumnosActualizado: JSON.parse(JSON.stringify(payload.accion)),
        isUpdatedAccion: payload.isUpdated,
        error: JSON.parse(JSON.stringify(payload.error))
    }));

});
