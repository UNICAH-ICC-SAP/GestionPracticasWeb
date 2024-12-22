import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
  addCase(Action.cleanStore, (state) => ({ ...state, ...INIT }));
  addCase(Action.cleanUserData, (state) => ({
    ...state,
    secciones: INIT.secciones
  }));
  addCase(Fetcher.getSecciones.fulfilled, (state, { payload }) => ({
    ...state,
    secciones: JSON.parse(JSON.stringify(payload.secciones)),
    error: JSON.parse(JSON.stringify(payload.error)),
  }));
  addCase(Fetcher.insertSeccion.fulfilled, (state, { payload }) => ({
    ...state,
    secciones: JSON.parse(JSON.stringify(payload.secciones)),
    error: JSON.parse(JSON.stringify(payload.error)),
  }));
  addCase(Fetcher.updateSeccion.fulfilled, (state, { payload }) => ({
    ...state,
    secciones: JSON.parse(JSON.stringify(payload.secciones)),
    error: JSON.parse(JSON.stringify(payload.error)),
  }));
});
