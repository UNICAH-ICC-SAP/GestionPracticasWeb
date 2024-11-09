import { CreateActions } from "../../../storeConfig";
import { Type as TypeModal } from "../../../Api/namespaces/modalError";

export const NAME = "Pensum";

export declare namespace Type {

  export type Carrera = {
    id_carrera: string;
    id_clase: string;
    id_bloque: number;
  }

  export type Pensum = {
    id_clase: string;
    nombre_clase: string;
    creditos: number;
    estado: boolean;
    es_lab: boolean;
  }
}

export declare namespace StorePensum {
  export type State = {
    pensum: Array<Type.Pensum>
    carrera: Array<Type.Carrera>
    error: TypeModal.ModalError
  }
}

export const Action = CreateActions<{
  cleanPensum: void;
  cleanCarrera: void;
  cleanStore: void;
  setPensum: boolean;
  setCarrera: boolean;
}>(NAME, ["cleanPensum", "cleanCarrera", "cleanStore", "setPensum", "setCarrera"]);

export const INIT: StorePensum.State = {
  pensum: [],
  carrera: [],
  error: {
    code: 0,
    message: ""
  },
}