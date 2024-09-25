import { CreateActions, CreateReducer, CreateSelector } from "../../storeConfig";
import type { StoreState } from "..";

export const NAME = "fetching";

export declare namespace StoreFetching {
    type fetching = boolean;
    type fetchingSdk = boolean;
    type fetchingReload = boolean;
    type withoutLoader = boolean;

    export type State = {
        fetching: fetching;
        fetchingSdk: fetchingSdk;
        fetchingReload?: fetchingReload;
        withoutLoader?: withoutLoader;
    };
}

export const INIT: StoreFetching.State = {
    fetching: false,
    fetchingSdk: false,
    fetchingReload: false,
    withoutLoader: false,
};

export function Selector(store: StoreState): StoreFetching.State {
    return store[NAME];
}

Selector.fetching = CreateSelector(Selector, (state) => state.fetching);
Selector.fetchingSdk = CreateSelector(Selector, (state) => state.fetchingSdk);
Selector.fetchingReload = CreateSelector(Selector, (state) => state.fetchingReload);
Selector.withoutLoader = CreateSelector(Selector, (state) => state.withoutLoader);

export const Action = CreateActions<{
    /** Sets fetching to either true or false */
    set: StoreFetching.State;
    /** setsh fetching to the inverse of its current state */
    toggle: never;
}>(NAME, ["set", "toggle"]);

export const Reducer = CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.set, (state, { payload }) => payload);
    addCase(Action.toggle, (state, { payload }) => payload);
});

export const SliceFetching = { [NAME]: Reducer };
