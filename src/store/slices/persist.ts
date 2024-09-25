import { CreateActions, CreateReducer, CreateSelector } from "../../storeConfig";
// import type { Type as TypeAlias } from "~/api/login/singleSelectDynamicAuthenticationByAlias";

import type { StoreState } from "..";

export const NAME = "persist";

export declare namespace StorePersist {
    export type State = {
        // alias?: TypeAlias.alias;
        showInstruction?: boolean;
        /** The version that is currently running  */
        version?: string;
        /**No show biometric message */
        notShowMessageBiometric?: boolean;
        /**Alias Registred in the biometric configuration */
        aliasBiometry?: string;
        /**Type of  biometric authentication*/
        biometryType?: string | null;
        /**Flag to know if the biometric authentication is configure */
        isBiometryConfigured?: boolean;
        /**Flag to know if go to the result of biometry configuration */
        isBiometryConfiguredResult?: boolean;
        /**Flag to know if biometry is avaliable */
        isBiomatryAvailable?: boolean;
        /**Ip Address */
        ipAddress?: string;
        /** Flag to display welcome message */
        showMessageWelcome?: boolean;
        /** Flag to know if client is new */
        isNewClient?: boolean;
        /** client first name */
        operatorFirstName?: string;
        /** operator first name */
        operatorNameHome?: string;
        /** Operator identificationType */
        operatorIdentificationType?: string;
        /** Operator identificationNumber */
        operatorIdentificationNumber?: string;
        /**Device os */
        deviceOs?: string;
    };

    export type ParamSet = Partial<State>;
    export type ParamClear = { key: string };
}

export const INIT: StorePersist.State = {};

export function Selector(store: StoreState): StorePersist.State {
    return store[NAME];
}

// Selector.alias = CreateSelector(Selector, (state) => state.alias);
Selector.showInstruction = CreateSelector(Selector, (state) => state.showInstruction);
Selector.notShowBioMessage = CreateSelector(Selector, (state) => state.notShowMessageBiometric);
Selector.aliasBiometry = CreateSelector(Selector, (state) => state.aliasBiometry);
Selector.biometryType = CreateSelector(Selector, (state) => state.biometryType);
Selector.isBiometryConfigured = CreateSelector(Selector, (state) => state.isBiometryConfigured);
Selector.isBiomatryAvailable = CreateSelector(Selector, (state) => state.isBiomatryAvailable);
Selector.isBiometryConfiguredResult = CreateSelector(
    Selector,
    (state) => state.isBiometryConfiguredResult,
);
Selector.version = CreateSelector(Selector, (state) => state.version);

Selector.ipAddress = CreateSelector(Selector, (state) => state.ipAddress);
Selector.showMessageWelcome = CreateSelector(Selector, (state) => state.showMessageWelcome);
Selector.isNewClient = CreateSelector(Selector, (state) => state.isNewClient);
Selector.operatorFirstName = CreateSelector(Selector, (state) => state.operatorFirstName);
Selector.operatorNameHome = CreateSelector(Selector, (state) => state.operatorNameHome);

Selector.operatorIdentificationType = CreateSelector(
    Selector,
    (state) => state.operatorIdentificationType,
);
Selector.operatorIdentificationNumber = CreateSelector(
    Selector,
    (state) => state.operatorIdentificationNumber,
);

Selector.deviceOs = CreateSelector(Selector, (state) => state.deviceOs);

export const Action = CreateActions<{
    /** Sets a give property errors */
    set: StorePersist.ParamSet;
    /** Cleans a key from the local storage */
    clear: StorePersist.ParamClear | null;
}>(NAME, ["set", "clear"]);

export const Reducer = CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.set, (state, { payload }) => ({ ...state, ...payload }));

    addCase(Action.clear, (state, { payload }) => {
        if (payload === null) return INIT;
        const { key } = payload;
        return { ...state, [key]: undefined };
    });
});

export const SlicePersist = { [NAME]: Reducer };
