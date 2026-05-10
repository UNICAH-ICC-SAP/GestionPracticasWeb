export const StatusTerna = {
    1: "Inactiva",
    2: "En Curso",
    3: "Revisión",
    4: "Agendada",
    5: "Finalizada",
}

export enum DocumentUploadStatus {
    PENDING = 'PENDING',
    UPLOADED = 'UPLOADED',
    FAILED = 'FAILED'
}

export enum DocumentStatus {
    PENDING = 'PENDING',
    DELIVERED = 'DELIVERED',
    CHANGE_REQUESTED = 'CHANGE_REQUESTED'
};

export enum TernaRolDocente {
    COORDINA = 'coordina',
    ESTILO = 'estilo',
    TECNICO = 'tecnico'
}

export enum DocumentTypeAlumnos {
    DATOS_GENERALES = 1,
    CARTA_ACEPTACION = 2,
    DNI_ALUMNO = 3,
    DNI_TESTIGO_1 = 4,
    DNI_TESTIGO_2 = 5,
    MONOGRAFIA = 6,
    SOLICITUD_PRACTICA = 7,
    CONSTANCIA_TERMINACION = 8
}

export enum DocumentTypeDocentes {
    MONOGRAFIA = 6,
    SOLICITUD_PRACTICA = 7,
    CONSTANCIA_TERMINACION = 8
}