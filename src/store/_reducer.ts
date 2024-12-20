import { CombineReducers } from "../storeConfig";
import { SliceFetching } from "./slices/fetching";
import { SliceError } from "./slices/error";
import { SlicePersist } from "./slices/persist";
// import { SliceOperators } from "./slices/operators";
import { SliceOnline } from "./slices/online";
// import { SliceRouter } from "./slices/router";
import { SliceConfiguration } from "./slices/configuration";
import { NAME as NAME_USER, Reducer as ReducerUser } from "./slices/users";
import { NAME as NAME_DOCENTES, Reducer as ReducerDocentes } from "./slices/docentes";
import { NAME as NAME_TERNAS, Reducer as ReducerTernas } from "./slices/ternas";
import { NAME as NAME_FACULTAD, Reducer as ReducerFacultad } from "./slices/facultades"
import { NAME as NAME_PENSUM, Reducer as ReducerPensum } from "./slices/pensums";
// import { NAME as NAME_FACULTAD, Reducer as ReducerFacultad } from "./slices/facultades";

export default CombineReducers({
    ...SliceFetching,
    ...SliceError,
    ...SlicePersist,
    // ...SliceOperators,
    ...SliceOnline,
    // ...SliceRouter,
    ...SliceConfiguration,
    [NAME_USER]: ReducerUser,
    [NAME_FACULTAD]: ReducerFacultad,
    [NAME_DOCENTES]: ReducerDocentes,
    [NAME_TERNAS]: ReducerTernas,
    [NAME_PENSUM]: ReducerPensum
});
