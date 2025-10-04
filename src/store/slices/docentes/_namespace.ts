import { CreateActions } from "../../../storeConfig";
import { Type as TypeModal } from '../../../Api/namespaces/modalError';

export const NAME = "Docente";

export declare namespace Type {
    export type DocenteInfo = {
        docenteId?: string;
        email: string;
        nombre: string;
        facultadId?: string;
        telefono: string;
        rol: string;
    }
}

export declare namespace StoreUser {
    export type State = {
        docente: Type.DocenteInfo;
        docentes: Array<Type.DocenteInfo>;
        error: TypeModal.ModalError;
        docenteUserCreated?: boolean;
    };
}

export const Action = CreateActions<{
    cleanUserData: void;
    cleanStore: void;
    setDocentes: boolean;
}>(NAME, ["cleanUserData", "cleanStore", "setDocentes"]);

export const INIT: StoreUser.State = {
    docente: {
        docenteId: '',
        nombre: '',
        telefono: '',
        email: '',
        facultadId: '',
        rol: ''
    },
    docentes: [],
    error: {
        code: 0,
        message: ""
    },
    docenteUserCreated: false,
};