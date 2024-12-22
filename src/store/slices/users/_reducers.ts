import { CreateReducer } from "../../../storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.cleanStore, (state) => ({ ...state, ...INIT }));
    addCase(Action.cleanUserData, (state) => ({
        ...state,
        user: INIT.user,
    }));
    addCase(Fetcher.login.fulfilled, (state, { payload }) => ({
        ...state,
        loginResponse: payload,
        user: payload.logged ? JSON.parse(JSON.stringify(payload.user)) : INIT.user,
        error: JSON.parse(JSON.stringify(payload.error)),
        logged: payload.logged,
        passwordResetRequired: payload.passwordResetRequired
    }));
    addCase(Action.setIsLogged, (state, { payload }) => ({
        ...state,
        logged: payload
    }));
    addCase(Fetcher.validateSession.fulfilled, (state, { payload }) => ({
        ...state,
        logged: payload.logged
    }));
    addCase(Fetcher.checkUserLogged.fulfilled, (state, { payload }) => ({
        ...state,
        user: JSON.parse(JSON.stringify(payload.user)),
        error: JSON.parse(JSON.stringify(payload.error)),
        logged: JSON.parse(JSON.stringify(payload.logged))
    }));
    addCase(Fetcher.userInfo.fulfilled, (state, { payload }) => ({
        ...state,
        userInfo: JSON.parse(JSON.stringify(payload.user))
    }));
    addCase(Fetcher.signUp.fulfilled, (state, { payload }) => ({
        ...state,
        userD: JSON.parse(JSON.stringify(payload))
    }));
    addCase(Fetcher.updateData.fulfilled, (state, { payload }) => ({
        ...state,
        updateResponse: {
            passwordResetResponse: payload,
            data: payload.data,
            error: payload.error,
            success: payload.success
        }
    }));
});
