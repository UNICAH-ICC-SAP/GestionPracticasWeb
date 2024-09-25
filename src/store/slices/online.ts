import { CreateActions, CreateReducer } from "../../storeConfig";
import { Store } from "../index";
import type { StoreState } from "..";

export const NAME = "online";

export declare namespace StoreOnline {
    type online = boolean;

    export type State = online;
}

export const INIT: StoreOnline.State = true;

export const Selector: (store: StoreState) => StoreOnline.State = (store) => store[NAME];

export const Action = CreateActions<{ set: StoreOnline.online }>(NAME, ["set"]);

export const Reducer = CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.set, (_, { payload }) => payload);
});

export const SliceOnline = { [NAME]: Reducer };

window.addEventListener("offline", () => Store.dispatch(Action.set(false)));
window.addEventListener("online", () => Store.dispatch(Action.set(true)));
