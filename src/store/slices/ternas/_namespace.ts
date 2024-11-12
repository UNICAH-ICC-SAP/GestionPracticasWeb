import { CreateActions } from "../../../storeConfig";
import { Type as TypeModal } from '../../../Api/namespaces/modalError';
import { Type as TypeAlumno } from "../alumnos/_namespace";

export const NAME = "Terna";

export declare namespace Type {
    export type TernaInfo = {
        ternaId: number;
        alumno: TypeAlumno.AlumnoInfo;
        detalleTernas: Array<DetalleTernaInfo>;
        idEstadoTerna: string
    }
    export type DetalleTernaInfo = {
        detalleTernaId: number;
        ternaId: number;
        docenteId: string;
        coordina: string;


    }
    export type UserCreation = {
        userId: string;
        pass: string;
        roleId: number;
    }
}

export declare namespace StoreUser {
    export type State = {
        ternaInfo: Type.TernaInfo;
        detallesTernasInfo: Array<Type.DetalleTernaInfo>;
        ternasInfo: Array<Type.TernaInfo>
        userToCreate: Type.UserCreation;
        error: TypeModal.ModalError;
        step1: boolean;
        step2: boolean;
        resumen: boolean;
    };
}

export const Action = CreateActions<{
    cleanUserData: void;
    cleanStore: void;
    getAlumno: void;
    setDataAlumno: TypeAlumno.AlumnoInfo;
    setUserCreate: Type.UserCreation;
    setDetalleTerna: Type.DetalleTernaInfo;
    setStep1: boolean;
    setStep2: boolean;
    setResumen: boolean;
}>(NAME, ["cleanUserData", "cleanStore", "setDataAlumno", "setStep1", "setStep2", "setResumen", "getAlumno", "setUserCreate", "setDetalleTerna"]);

export const INIT: StoreUser.State = {
    ternaInfo: {
        ternaId: 0,
        idEstadoTerna: '',
        alumno: {
            alumnoId: '',
            nombre: '',
            email: '',
            facultadId: '',
            telefono: '504'
        },
        detalleTernas: []
    },
    
    detallesTernasInfo: [],
    userToCreate: {
        userId: '',
        pass: '',
        roleId: 3
    },
    ternasInfo: [],
    error: {
        code: 0,
        message: ""
    },
    step1: true,
    step2: false,
    resumen: false
};