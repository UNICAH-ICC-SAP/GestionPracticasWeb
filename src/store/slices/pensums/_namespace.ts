import { CreateActions } from "../../../storeConfig";
import { Type as TypeModal } from "../../../Api/namespaces/modalError";

export const NAME = "Pensum";

export declare namespace Type {
  export type ClaseInfo = {
    id_clase: string;
    nombre_clase: string;
    creditos: number;
    estado: boolean;
    TipoClase: number;
  };

  export type CarreraInfo = {
    id_ccb: number;
    facultadId: string;
    id_clase: string;
    id_bloque: number;
  };
}

export declare namespace StorePensum {
  export type State = {
    clases: Array<Type.ClaseInfo>;
    carreras: Array<Type.CarreraInfo>;
    error: TypeModal.ModalError;
  };
}

export const Action = CreateActions<{
  cleanUserData: void;
  cleanStore: void;
  setClases: boolean;
  setCarreras: boolean;
}>(NAME, ["cleanStore", "cleanUserData", "setClases", "setCarreras"]);

export const INIT: StorePensum.State = {
  clases: [],
  carreras: [],
  error: {
    code: 0,
    message: "",
  }
};