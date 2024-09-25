import { CreateActions, CreateReducer } from "../../storeConfig";
import type { StoreState } from "..";

export const NAME = "error";

export declare namespace StoreError {
    type error = {
        /** Key for index */
        name: string;
        /** Body message of modal (subtitle modals)*/
        message: string;
        /** Title of modal */
        title?: string;
        /** Type of modal */
        type?: string;
        /** First button text of modal */
        firstButtonText?: string;
        /** Second button text of modal */
        secondButtonText?: string;
        /**Function Accept */
        onAccept?: () => void;
        /**Function Cancel */
        onCancel?: () => void;
    };

    export type State = error[];
}

export const INIT: StoreError.State = [];

export const Selector: (store: StoreState) => StoreError.State = (store) => store[NAME];

export const Action = CreateActions<{
    /** Sets active errors */
    set: StoreError.error[];
    /** Clears active errors */
    clear: never;
}>(NAME, ["set", "clear"]);

export const Reducer = CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.set, (state, { payload }) => payload);
    addCase(Action.clear, () => {
        //TODO:  Validar esta soluccion no es la mas optima
        const rootContainer = window.document.getElementById("root");
        rootContainer?.removeAttribute("style");
        return INIT;
    });
});

export const SliceError = { [NAME]: Reducer };
