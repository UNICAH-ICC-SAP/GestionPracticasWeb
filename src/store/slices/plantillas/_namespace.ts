import { Type as TypeModal } from './../../../Api/namespaces/modalError';
import { CreateActions } from "../../../storeConfig";


export const NAME = "Plantillas";

export declare namespace Type {
    export type PlantillaInfo = {
        Id_correo: number;
        correo_origen: string;
        correo_password: string;
        asunto: string;
        cuerpo: string;
        estado: boolean;
    }
}

export declare namespace StorePlantillas {
    export type State = {
        plantilla: Type.PlantillaInfo;
        plantillas: Array<Type.PlantillaInfo>;
        error: TypeModal.ModalError;
        isSavedPlantillaState: boolean
    };
}

export const Action = CreateActions<{
    cleanAlumno: void;
    cleanStore: void;
}>(NAME, ["cleanAlumno", "cleanStore"]);


export const INIT: StorePlantillas.State = {
    plantilla: {
        Id_correo: 0,
        correo_origen: "",
        correo_password: "",
        asunto: "",
        cuerpo: "",
        estado: false,
    },
    plantillas: [],
    error: {
        code: 0,
        message: ""
    },
    isSavedPlantillaState: false,
};
