import { Type as TypeModal } from './../../../Api/namespaces/modalError';
import { CreateActions } from "../../../storeConfig";


export const NAME = "AccionesPlantillas";

export declare namespace Type {
    export type AccionesInfo = {
        idAccionPlantilla: number;
        accion: string;
        plantillaCorreoId: number;
    }
}

export declare namespace StoreAccionPlantillas {
    export type State = {
        accionPlantilla: Type.AccionesInfo;
        accionPlantillas: Array<Type.AccionesInfo>;
        isSavedAccionPlantilla: boolean;
        isUpdatedAccion: boolean;
        error: TypeModal.ModalError;
    };
}

export const Action = CreateActions<{
    cleanAccion: void;
    cleanStore: void;
    setAlumno: object;
}>(NAME, ["cleanAccion", "cleanStore", "setAlumno"]);


export const INIT: StoreAccionPlantillas.State = {
    accionPlantilla: {
        idAccionPlantilla: 0,
        accion: "",
        plantillaCorreoId: 0,
    },
    accionPlantillas: [],
    error: {
        code: 0,
        message: ""
    },
    isSavedAccionPlantilla: false,
    isUpdatedAccion: false,
};
