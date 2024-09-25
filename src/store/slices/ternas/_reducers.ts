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
        step2: !payload
    }));
    addCase(Action.setStep2, (state, { payload }) => ({
        ...state,
        step1: !payload,
        step2: payload
    }));
    addCase(Action.setResumen, (state, { payload }) => ({
        ...state,
        step1: !payload,
        step2: !payload,
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
            userId: payload.userId,
            pass: Math.random().toString(36).slice(-8)
        }
    }));
    addCase(Fetcher.getDetalleTernas.fulfilled, (state, { payload }) => ({
        ...state,
        ternasInfo: JSON.parse(JSON.stringify(payload.detalleTernas)),
        error: JSON.parse(JSON.stringify(payload.error)),
        logged: JSON.parse(JSON.stringify(payload.logged))
    }));
});
