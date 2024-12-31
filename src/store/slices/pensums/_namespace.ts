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
    bloque?: number
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
    clases: Array<Type.ClaseInfo> | null;
    carreras: Array<Type.CarreraInfo> | null;
    error: TypeModal.ModalError;
    loading: boolean;
    update: boolean;
  };
}

export const Action = CreateActions<{
  cleanUserData: void;
  cleanStore: void;
  setClases: boolean;
  setCarreras: boolean;
  setIsLoading: boolean;
  setIsUpdate: boolean;
}>(NAME, ["cleanStore", "cleanUserData", "setClases", "setCarreras", "setIsLoading", "setIsUpdate"]);

export const INIT: StorePensum.State = {
  clases: null,
  carreras: null,
  error: {
    code: 0,
    message: "",
  },
  loading: false,
  update: false
};