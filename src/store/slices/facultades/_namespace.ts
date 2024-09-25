import { CreateActions } from "../../../storeConfig";

export const NAME = "Facultades";

export declare namespace Type {
    export type Facultad = {
        facultadId: string;
        nombreFacultad: string;
        estadoFacultad: boolean;
    }
}

export declare namespace StoreFacultad {
    export type State = {
        facultad: Type.Facultad;
        facultades: Array<Type.Facultad>;
    };
}

export const Action = CreateActions<{
    cleanFacultad: void;
    cleanStore: void;
    setFacultad: object;
}>(NAME, ["cleanFacultad", "cleanStore", "setFacultad"]);

export const INIT: StoreFacultad.State = {
    facultad: {
        facultadId: "",
        nombreFacultad: "",
        estadoFacultad: false,
    },
    facultades: []
};