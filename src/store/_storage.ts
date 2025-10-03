import { CreateStorage, StorageDriver } from "../storeConfig";

import { NAME as NAME_PERSIST } from "./slices/persist";
import { NAME as NAME_USER } from "./slices/users";

export default CreateStorage([
    { key: NAME_PERSIST, type: StorageDriver.LOCAL, },
    { key: NAME_USER, type: StorageDriver.LOCAL, },
]);
