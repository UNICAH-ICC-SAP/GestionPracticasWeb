import { CreateActions } from '../../../storeConfig';
import { Type as TypeModal } from '../../../Api/namespaces/modalError';

export const NAME = 'User';

export declare namespace Type {
    export type User = {
        nombreUsuario: string;
        userId: string;
        roleId: number;
        message: string;
        token: string;
        passwordResetRequired: boolean;  
    }
    export type UserInfo = {
        userInfo: string;
        email: string;
        nombre: string;
        facultadId: string;
        telefono: string;
    }
}

export declare namespace StoreUser {
    export type State = {
        user: Type.User;
        userInfo: Type.UserInfo;
        error: TypeModal.ModalError;
        loading: boolean;
        logged: boolean;
        passwordResetRequired: boolean;
    };
}

export const Action = CreateActions<{
    cleanUserData: void;
    cleanStore: void;
    updateUser: Type.User;
    setIsLogged: boolean;
    checkLogin: void;
    validateSesion: void;
}>(NAME, ['updateUser', 'checkLogin', 'cleanUserData', 'cleanStore', 'setIsLogged', 'validateSesion']);

export const INIT: StoreUser.State = {
    user: {
        nombreUsuario: '',
        userId: '',
        roleId: 0,
        message: '',
        token: '',
        passwordResetRequired: true, 
    },
    userInfo: {
        userInfo: '',
        email: '',
        nombre: '',
        facultadId: '',
        telefono: '',
    },
    error: {
        code: 0,
        message: ''
    },
    loading: false,
    logged: false,
    passwordResetRequired: false,
};