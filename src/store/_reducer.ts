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
import { NAME as NAME_PENSUM, Reducer as ReducerPensum } from "./slices/pensums";
import { NAME as NAME_SECCIONES, Reducer as ReducerSecciones } from "./slices/secciones";
import { NAME as NAME_ALUMNOS, Reducer as ReducerAlumnos } from "./slices/alumnos";
import { NAME as NAME_FACULTAD, Reducer as ReducerFacultad } from "./slices/facultades";
import { NAME as NAME_PERIODO, Reducer as ReducerPeriodo } from "./slices/periodo";
import { NAME as NAME_PLANTILLAS, Reducer as ReducerPlantillas } from "./slices/plantillas";
import { NAME as NAME_ACCION_PLANTILLAS, Reducer as ReducerAccionPlantillas } from "./slices/accionesPlantilla";
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
    [NAME_PENSUM]: ReducerPensum,
    [NAME_SECCIONES]: ReducerSecciones,
    [NAME_ALUMNOS]: ReducerAlumnos,
    [NAME_PERIODO]: ReducerPeriodo,
    [NAME_PLANTILLAS]: ReducerPlantillas,
    [NAME_ACCION_PLANTILLAS]: ReducerAccionPlantillas,
});
