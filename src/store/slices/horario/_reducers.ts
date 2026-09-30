import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
  addCase(Action.cleanStore, (state) => ({ ...state, ...INIT }));
  addCase(Action.cleanUserData, (state) => ({
    ...state,
    disponibilidades: INIT.disponibilidades
  }));
  addCase(Fetcher.getHorario.fulfilled, (state, { payload }) => ({
    ...state,
    disponibilidades: JSON.parse(JSON.stringify(payload.disponibilidades)),
    error: JSON.parse(JSON.stringify(payload.error)),
  }));
  addCase(Fetcher.saveHorario.fulfilled, (state, { payload }) => ({
    ...state,
    error: JSON.parse(JSON.stringify(payload.error)),
    update: payload.update
  }));
  addCase(Fetcher.deleteHorario.fulfilled, (state, { payload }) => ({
    ...state,
    error: JSON.parse(JSON.stringify(payload.error)),
    update: payload.update
  }));
  addCase(Action.setIsUpdate, (state, { payload }) => ({
    ...state,
    update: payload
  }));
});
