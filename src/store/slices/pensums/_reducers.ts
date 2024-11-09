import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
  addCase(Action.cleanStore, (state) =>  ({
    ...state,
    ...INIT, 
  }))
  addCase(Action.cleanPensum, (state) => ({ 
    ...state,
    pensum: INIT.pensum,
  })) 
  addCase(Action.cleanCarrera, (state) => ({ 
    ...state,
    carrera: INIT.carrera,
  })) 
  addCase(Fetcher.getPensum.fulfilled, (state, { payload }) => ( 
    {
    ...state,
    pensum: JSON.parse(JSON.stringify(payload.pensum)),
  })) 
  addCase(Fetcher.getCarreraBy.fulfilled, (state, { payload }) => ( 
    {
    ...state,
    carrera: JSON.parse(JSON.stringify(payload.carrera)),
  }))
  addCase(Fetcher.insertClase.fulfilled, (state, { payload }) => ( 
    {
    ...state,
    clase: JSON.parse(JSON.stringify(payload.clase)),
  }))
  addCase(Fetcher.updateClase.fulfilled, (state, { payload }) => ( 
    {
    ...state,
    clase: JSON.parse(JSON.stringify(payload.clase)),
  }))
  addCase(Fetcher.updateStatus.fulfilled, (state, { payload }) => ( 
    {
    ...state,
    clase: JSON.parse(JSON.stringify(payload.clase)),
  })) 
});