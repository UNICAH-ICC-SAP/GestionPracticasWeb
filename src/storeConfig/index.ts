import * as Redux from "react-redux";
import * as Toolkit from "@reduxjs/toolkit";

import { ACTION, NAME } from "./_namespace";
import type { SliceCfg } from "./_storage";
import { Storage as _Storage, StorageReducer } from "./_storage";

const { REACT_APP_NAME, NODE_ENV } = import.meta.env;
const storageName = REACT_APP_NAME || "root";

export const CreateSelector = Toolkit.createSelector;
export const CreateReducer = Toolkit.createReducer;
export const CreateEntityAdapter = Toolkit.createEntityAdapter;

export { default as CreateActions } from "./_actions";
export { default as CreateFetchers } from "./_fetchers";
export { StorageDriver, StorageGetDriver } from "./_storage";

export const Current = Toolkit.current;

export const ProviderStore = Redux.Provider;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CombineReducers<S>(reducers: Toolkit.ReducersMapObject<S, any>) {
    return Toolkit.combineReducers(reducers);
}

export function CreateStorage(slices: SliceCfg[], name: string = storageName) {
    return _Storage(name, slices);
}

type CreateStoreArgs<S> = {
    Storage: ReturnType<typeof CreateStorage>;
    Reducer: Toolkit.Reducer<S>;
};

export function CreateStore<S>({ Storage, Reducer }: CreateStoreArgs<S>) {
    const INIT_INDEX = 0;
    // Root Reducer: doing something globally or at startup? this is where you do it.
    const reducer: Toolkit.Reducer<S> = (state, action) => {
        if (action.type.indexOf(NAME) !== INIT_INDEX) return Reducer(state, action);
        if (!state) return state as S;
        // if there's something global that should happen to the state, this is where to add it:
        let nextState = state;

        // handle internal storage operations
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        nextState = StorageReducer<S>({ store: Store, self: Storage, state: nextState, action })!;

        return nextState;
    };

    const Store = Toolkit.configureStore({
        devTools: NODE_ENV !== "production",
        reducer,
        // NOTE: if adding new middleware, use .concat or .prepend to correctly infer typings
        // https://redux-toolkit.js.org/usage/usage-with-typescript#correct-typings-for-the-dispatch-type
        middleware(getDefaultMiddleware) {
            const defaultMiddleware = getDefaultMiddleware({
                serializableCheck: false,
            });
            return defaultMiddleware.concat([Storage.storageMiddleware]);
        },
    });

    // Once the store has instantiated, run the root Reducer.
    Store.dispatch({ type: ACTION.INIT });

    function useDispatch() {
        type StoreDispatch = typeof Store.dispatch;
        return Redux.useDispatch<StoreDispatch>();
    }

    return { Store, useDispatch, useSelector: Redux.useSelector };
}
