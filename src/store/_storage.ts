import { CreateStorage, StorageDriver } from "../storeConfig";

import { NAME as NAME_PERSIST } from "./slices/persist";

export default CreateStorage([{ key: NAME_PERSIST, type: StorageDriver.LOCAL }]);
