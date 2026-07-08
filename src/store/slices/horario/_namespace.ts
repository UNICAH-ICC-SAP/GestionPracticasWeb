import { CreateActions } from "../../../storeConfig";
import { Type as TypeModal } from "../../../Api/namespaces/modalError";

export const NAME = "Horario";

export declare namespace Type {
  export type HorarioDisponibilidad = {
    id?: number;
    docenteId: string;
    dia: number;
    franja_inicio: string;
    franja_fin: string;
    disponible: boolean;
    tipo?: string;
  };
}

export declare namespace StoreHorario {
  export type State = {
    disponibilidades: Array<Type.HorarioDisponibilidad>;
    error: TypeModal.ModalError;
    update: boolean;
  };
}

export const Action = CreateActions<{
  cleanUserData: void;
  cleanStore: void;
  setDisponibilidades: boolean;
  setIsUpdate: boolean;
}>(NAME, ["cleanStore", "cleanUserData", "setDisponibilidades", "setIsUpdate"]);

export const INIT: StoreHorario.State = {
  disponibilidades: [],
  error: {
    code: 0,
    message: "",
  },
  update: false,
};
