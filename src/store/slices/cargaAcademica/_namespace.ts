import { CreateActions } from "../../../storeConfig";

export const NAME = "CargaAcademica";

export type FilaCarga = {
    docenteId: string;
    nombre_docente: string;
    codigo: string;
    nombre_clase: string;
    seccion: string;
    fecha_inicio: string;
    fecha_final: string;
    hora_inicio: string;
    hora_final: string;
    dias: string;
    campus: string;
    observacion: string;
    fila: number;
    errores: string[];
    advertencias: string[];
    destinos?: string[];
};

export type State = {
    filas: FilaCarga[];
    loading: boolean;
    error: string;
    registros: number;
    duplicados: number;
    resultado: { insertados: number; duplicados: number } | null;
};

export const INIT: State = {
    filas: [],
    loading: false,
    error: "",
    registros: 0,
    duplicados: 0,
    resultado: null,
};

export const Action = CreateActions<{ cleanStore: void }>(NAME, ["cleanStore"]);
