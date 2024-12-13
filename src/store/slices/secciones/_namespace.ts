import { CreateActions } from "../../../storeConfig";
import { Type as TypeModal } from "../../../Api/namespaces/modalError";

export const NAME = "Seccion";

export declare namespace Type {
  export type SeccionInfo = {
    id_detalle: number;
    seccion: string;
    docenteId: string;
    id_ccb: number;
    id_periodo: string;
    hora_inicio: string;
    dia_inicio: number;
    dia_final: number;
    hora_final: string;
  };
}

export declare namespace StoreSeccion {
  export type State = {
    secciones: Array<Type.SeccionInfo>;
    error: TypeModal.ModalError;
  };
}

export const Action = CreateActions<{
  cleanUserData: void;
  cleanStore: void;
  setSecciones: boolean;
}>(NAME, ["cleanStore", "cleanUserData", "setSecciones"]);

export const INIT: StoreSeccion.State = {
  secciones: [],
  error: {
    code: 0,
    message: "",
  }
};