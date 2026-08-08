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
        rol: string;
    }
    export type UserCreation = {
        userId: string;
        pass: string;
        roleId: number;
    }
    export type MonografiaDocente = {
        docenteId: string;
        nombre: string;
        email: string;
        telefono: string;
        rol: string;
    }
    export type MonografiaArchivo = {
        archivoId: number;
        originalName: string;
        fileUrl: string;
        status: string;
        fileStatus: string;
        mimeType: string;
        sizeBytes: number;
    }
    export type MonografiaCompleta = {
        ternaId: number;
        estado: string;
        idEstadoTerna: number;
        alumno: {
            alumnoId: string;
            nombre: string;
            email: string;
            telefono: string;
            facultadId: string;
        };
        docentes: MonografiaDocente[];
        monografia: MonografiaArchivo | null;
    } | null;
}

export declare namespace StoreUser {
    export type State = {
        ternaInfo: Type.TernaInfo;
        detallesTernasInfo: Array<Type.DetalleTernaInfo>;
        savedTernaInfo: Type.TernaInfo;
        ternasInfo: Array<Type.TernaInfo>
        userToCreate: Type.UserCreation;
        ternaCreatedState: boolean;
        ternaDetailCreateState: boolean;
        error: TypeModal.ModalError;
        step1: boolean;
        step2: boolean;
        resumen: boolean;
        updateStatus: boolean;
        monografiaCompleta: Type.MonografiaCompleta;
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
    setUpdatedStatus: boolean;
    setNoDroppedData: Type.DetalleTernaInfo[];
}>(NAME, ["cleanUserData", "cleanStore", "setDataAlumno", "setStep1", "setStep2", "setResumen", "getAlumno", "setUserCreate", "setDetalleTerna", "setNoDroppedData", "setUpdatedStatus"]);

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
    savedTernaInfo: {
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
    resumen: false,
    ternaCreatedState: false,
    ternaDetailCreateState: false,
    updateStatus: false,
    monografiaCompleta: null,
};