import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.cleanStore, () => ({ ...INIT }));
    addCase(Fetcher.preview.pending, state => ({ ...state, filas: [], loading: true, error: "", resultado: null }));
    addCase(Fetcher.preview.fulfilled, (state, { payload }) => ({
        ...state,
        filas: payload.filas || [],
        registros: payload.registros || 0,
        duplicados: payload.duplicados || 0,
        loading: false,
        error: payload.error,
    }));
    addCase(Fetcher.preview.rejected, state => ({ ...state, loading: false, error: "No se pudo leer el archivo." }));
    addCase(Fetcher.confirm.pending, state => ({ ...state, loading: true, error: "", resultado: null }));
    addCase(Fetcher.confirm.fulfilled, (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload.error,
        resultado: payload.error ? null : { insertados: payload.insertados, duplicados: payload.duplicados },
        filas: payload.error ? state.filas : [],
    }));
    addCase(Fetcher.confirm.rejected, state => ({ ...state, loading: false, error: "No se pudo guardar la carga." }));
    addCase(Fetcher.excel.pending, state => ({ ...state, loading: true, error: "" }));
    addCase(Fetcher.excel.fulfilled, (state, { payload }) => ({ ...state, loading: false, error: payload.error }));
    addCase(Fetcher.excel.rejected, state => ({ ...state, loading: false, error: "No se pudo descargar Excel." }));
});
