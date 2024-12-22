import { CreateSelector } from "../../../storeConfig";
import type { StoreState } from "../..";
import type { StoreUser } from "./_namespace";

import { NAME } from "./_namespace";

export default function Selector(store: StoreState): StoreUser.State {
    return store[NAME];
}

/**Selector: get accountDetails data */
Selector.getUser = CreateSelector(Selector, (state) => state.user);

Selector.getError = CreateSelector(Selector, (state) => state.error);
Selector.IsLogged = CreateSelector(Selector, (state) => state.logged)
Selector.getUserInfo = CreateSelector(Selector, (state) => state.userInfo)
/**Selector: fetching is loading */
Selector.fetching = CreateSelector(Selector, (state) => state.loading);
Selector.getPasswordResetRequired = CreateSelector(Selector, (state) => state.passwordResetRequired);


