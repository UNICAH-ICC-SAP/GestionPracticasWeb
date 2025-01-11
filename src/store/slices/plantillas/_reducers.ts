import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {

    addCase(Action.cleanStore, () => ({
        ...INIT,
    }));
    addCase(Action.cleanAlumno, (state) => ({
        ...state,
        plantilla: INIT.plantilla,
    }));
    addCase(Fetcher.getPlantillas.fulfilled, (state, { payload }) => ({
        ...state,
        plantillas: JSON.parse(JSON.stringify(payload.plantillas)),
    }));
    addCase(Fetcher.sendEmail.fulfilled, (state, { payload }) => ({
        ...state,
        isSavedUser: payload.isSavedUser
    }));
    addCase(Fetcher.savePlantilla.fulfilled, (state, { payload }) => ({
        ...state,
        saveDataAlumno: JSON.parse(JSON.stringify(payload.plantilla)),
        isSavedPlantillaState: payload.isSavedPlantillaState
    }));
    addCase(Fetcher.updatealumno.fulfilled, (state, { payload }) => ({
        ...state,
        alumnosActualizado: JSON.parse(JSON.stringify(payload.plantilla)),
        error: JSON.parse(JSON.stringify(payload.error))
    }));

});
