import { CreateActions } from "../../../storeConfig";
import { Type as TypeModal } from "../../../Api/namespaces/modalError";

export const NAME = "Seccion";

export declare namespace Type {
  export type ClaseData = {
    id_clase: string;
    nombre_clase: string;
    creditos: number;
    TipoClase: number;
  };

  export type CcbData = {
    id_ccb: number;
    facultadId: string;
    id_bloque: number;
    clase?: ClaseData;
  };

  export type SeccionInfo = {
    id_clase: string;
    id_detalle: number;
    seccion: string;
    docenteId: string;
    id_ccb: number;
    id_periodo: string;
    hora_inicio: string;
    dia_inicio: number;
    dia_final: number;
    hora_final: string;
    horario_especial?: boolean;
    ccb?: CcbData;
  };
}

export declare namespace StoreSeccion {
  export type State = {
    secciones: Array<Type.SeccionInfo>;
    error: TypeModal.ModalError;
    update: boolean;
  };
}

export const Action = CreateActions<{
  cleanUserData: void;
  cleanStore: void;
  setSecciones: boolean;
  setIsUpdate: boolean;
}>(NAME, ["cleanStore", "cleanUserData", "setSecciones", "setIsUpdate"]);

export const INIT: StoreSeccion.State = {
  secciones: [],
  error: {
    code: 0,
    message: "",
  },
  update: false,
};