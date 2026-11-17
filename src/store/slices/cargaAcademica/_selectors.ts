import { StoreState } from "@store/index";
import { NAME, State } from "./_namespace";

export default function Selector(store: StoreState): State {
    return store[NAME];
}
