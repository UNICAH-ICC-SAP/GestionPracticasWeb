import { CreateActions, CreateReducer } from "../../storeConfig";
import type { StoreState } from "..";

export const NAME = "configuration";

export declare namespace StoreConfiguration {
    type configuration = {
        error: boolean;
    };

    export type State = configuration;
}

export const INIT: StoreConfiguration.State = {
    error: false,
};

export const Selector: (store: StoreState) => StoreConfiguration.State = (store) => store[NAME];

export const Action = CreateActions<{
    /** Sets active errors */
    set: StoreConfiguration.configuration;
    /** Clears active errors */
    clear: never;
}>(NAME, ["set", "clear"]);

export const Reducer = CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.set, (state, { payload }) => payload);
    addCase(Action.clear, () => INIT);
});

export const SliceConfiguration = { [NAME]: Reducer };
