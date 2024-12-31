import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.cleanStore, (state) => ({ ...state, ...INIT }));
    addCase(Action.cleanUserData, (state) => ({
        ...state,
        ternaInfo: INIT.ternaInfo,
    }));
    addCase(Action.setDataAlumno, (state, { payload }) => ({
        ...state,
        ternaInfo: {
            ...state.ternaInfo,
            alumno: {
                ...payload,
            }
        },
    }));
    addCase(Action.setStep1, (state, { payload }) => ({
        ...state,
        step1: payload,
        step2: false,
        resumen: false,
    }));
    addCase(Action.setStep2, (state, { payload }) => ({
        ...state,
        step1: false,
        step2: payload,
        resumen: false
    }));
    addCase(Action.setResumen, (state, { payload }) => ({
        ...state,
        step1: false,
        step2: false,
        resumen: payload
    }));
    addCase(Action.setDetalleTerna, (state, { payload }) => ({
        ...state,
        ternaInfo: {
            ...state.ternaInfo,
            detalleTernas: [...state.ternaInfo.detalleTernas, payload]
        }
    }));
    addCase(Action.setUserCreate, (state, { payload }) => ({
        ...state,
        userToCreate: {
            ...payload,
            passwordResetRequired: 1
        }
    }));
    addCase(Fetcher.getDetalleTernas.fulfilled, (state, { payload }) => ({
        ...state,
        detallesTernasInfo: JSON.parse(JSON.stringify(payload.detalleTernasInfo)),
        error: JSON.parse(JSON.stringify(payload.error)),
        logged: JSON.parse(JSON.stringify(payload.logged))
    }));
    addCase(Fetcher.getTernasInfo.fulfilled, (state, { payload }) => ({
        ...state,
        ternasInfo: JSON.parse(JSON.stringify(payload.ternasInfo)),
        error: JSON.parse(JSON.stringify(payload.error)),
        logged: JSON.parse(JSON.stringify(payload.logged))
    }));
    addCase(Fetcher.saveDetalleTernas.fulfilled, (state, { payload }) => ({
        ...state,
        saveDetalleTernas: JSON.parse(JSON.stringify(payload.detalleTernas)),
        ternaDetailCreateState: payload.savedDetailTerna,
    }));
    addCase(Fetcher.saveTernas.fulfilled, (state, { payload }) => ({
        ...state,
        savedTernaInfo: JSON.parse(JSON.stringify(payload.savedTerna)),
        ternaCreatedState: payload.savedTernaState
    }));
});
