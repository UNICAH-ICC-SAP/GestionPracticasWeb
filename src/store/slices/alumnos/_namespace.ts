import { Type as TypeModal } from './../../../Api/namespaces/modalError';
import { CreateActions } from "../../../storeConfig";


export const NAME = "Alumnos";

export declare namespace Type {
    export type AlumnoInfo = {
        alumnoId: string;
        nombre: string;
        facultadId: string;
        email: string;
        telefono: string;
    }
}

export declare namespace StoreAlumnos {
    export type State = {
        alumno: Type.AlumnoInfo;
        alumnos: Array<Type.AlumnoInfo>;
        isSavedUser: boolean;
        isSavedAlumno: boolean;
        error: TypeModal.ModalError;
    };
}

export const Action = CreateActions<{
    cleanAlumno: void;
    cleanStore: void;
    setAlumno: object;
}>(NAME, ["cleanAlumno", "cleanStore", "setAlumno"]);


export const INIT: StoreAlumnos.State = {
    alumno: {
        alumnoId: "",
        nombre: "",
        facultadId: "",
        email: "",
        telefono: "",
    },
    alumnos: [],
    error: {
        code: 0,
        message: ""
    },
    isSavedUser: false,
    isSavedAlumno: false,
};
