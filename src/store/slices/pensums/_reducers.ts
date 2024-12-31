import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
  addCase(Action.cleanStore, (state) => ({
    ...state,
    ...INIT,
  }));
  addCase(Action.cleanUserData, (state) => ({
    ...state,
    clases: INIT.clases,
    carreras: INIT.carreras,
  }));
  addCase(Fetcher.getClases.fulfilled, (state, { payload }) => ({
    ...state,
    clases: JSON.parse(JSON.stringify(payload.clases)),
    error: JSON.parse(JSON.stringify(payload.error)),
  }));
  addCase(Fetcher.getCarreras.fulfilled, (state, { payload }) => ({
    ...state,
    carreras: JSON.parse(JSON.stringify(payload.carreras)),
    error: JSON.parse(JSON.stringify(payload.error)),
  }));
  addCase(Fetcher.insertClase.fulfilled, (state, { payload }) => ({
    ...state,
    clases: JSON.parse(JSON.stringify(payload.clases)),
    error: JSON.parse(JSON.stringify(payload.error)),
    update: payload.update
  }));
  addCase(Fetcher.updateClase.fulfilled, (state, { payload }) => ({
    ...state,
    clases: JSON.parse(JSON.stringify(payload.clases)),
    error: JSON.parse(JSON.stringify(payload.error)),
    update: payload.update
  }));
  addCase(Action.setIsLoading, (state, { payload }) => ({
    ...state,
    loading: payload
  }));
  addCase(Action.setIsUpdate, (state, { payload }) => ({
    ...state,
    update: payload
  }));
});
