import { CreateActions } from "../../../storeConfig";
import { Type as TypeModal } from '../../../Api/namespaces/modalError';

export const NAME = "Periodo";

export declare namespace Type {
    export type PeriodoInfo = {
        fecha_inicio: string;
        fecha_final: string;
        id_periodo: string;
    };
}

export declare namespace StorePeriodo {
    export type State = {
        nuevoPeriodo: Type.PeriodoInfo;
        periodos: Type.PeriodoInfo[] | null;
        error: TypeModal.ModalError;
    };
}

export const Action = CreateActions<{
    cleanStore: void;
    setPeriodo: boolean;
}>(NAME, ["cleanStore", "setPeriodo"]);

export const INIT: StorePeriodo.State = {
    nuevoPeriodo: {
        fecha_inicio: '',
        fecha_final: '',
        id_periodo: '',
    },
    periodos: null,
    error: {
        code: 0,
        message: ''
    },
};
