import { CreateActions } from "../../../storeConfig";

export const NAME = "Facultades";

export declare namespace Type {
    export type AlumnoInfo = {
        alumnoId: string;
        nombre: string;
        facultadId: string;
        email: string;
        telefono: string;
    }
}

export declare namespace StoreFacultad {
    export type State = {
        facultad: Type.AlumnoInfo;
        facultades: Array<Type.AlumnoInfo>;
    };
}

export const Action = CreateActions<{
    cleanFacultad: void;
    cleanStore: void;
    setFacultad: object;
}>(NAME, ["cleanFacultad", "cleanStore", "setFacultad"]);

export const INIT: StoreFacultad.State = {
    facultad: {
        alumnoId: "",
        nombre: "",
        facultadId: "",
        email: "",
        telefono: "",
    },
    facultades: []
};