import type { Document, DocumentConfig } from "@components/shared/documentCard/type";
import { DocumentStatus, DocumentTypeAlumnos } from "@root/abstracts";

export const DocumentTypeAlumnosLabel = {
    [DocumentTypeAlumnos.DATOS_GENERALES]: "Datos Generales",
    [DocumentTypeAlumnos.CARTA_ACEPTACION]: "Carta de Aceptación",
    [DocumentTypeAlumnos.DNI_ALUMNO]: "Identificación del Alumno",
    [DocumentTypeAlumnos.DNI_TESTIGO_1]: "Identificación del Testigo 1",
    [DocumentTypeAlumnos.DNI_TESTIGO_2]: "Identificación del Testigo 2",
    [DocumentTypeAlumnos.MONOGRAFIA]: "Monografía",
    [DocumentTypeAlumnos.SOLICITUD_PRACTICA]: "Solicitud de Práctica",
    [DocumentTypeAlumnos.CONSTANCIA_TERMINACION]: "Constancia de Finalización",
};

export const DocumentUserConfigMap: Record<DocumentTypeAlumnos, DocumentConfig> = {
    [DocumentTypeAlumnos.DATOS_GENERALES]: {
        title: "Datos Generales",
        description: "Documento con los datos generales del alumno.",
        exampleDocument: "https://docs.google.com/document/d/1V_CSQgD4gmLfAYFN8qC8rpy80HdLVVVM/edit"
    },
    [DocumentTypeAlumnos.CARTA_ACEPTACION]: {
        title: "Carta de Aceptación",
        description: "Documento que acepta la solicitud del alumno para la práctica profesional.",
        exampleDocument: "https://drive.google.com/file/d/1gs8XPUoDcHMb2zAM41IlgjbycdjtE5-Z/view"
    },
    [DocumentTypeAlumnos.DNI_ALUMNO]: {
        title: "Identificación del Alumno",
        description: "Documento con la DNI del alumno.",
        exampleDocument: "https://drive.google.com/file/d/1T6GuMwFRMMF-G_cyT6Qg9rXLkcdaiE9X/view"
    },
    [DocumentTypeAlumnos.DNI_TESTIGO_1]: {
        title: "Identificación del Testigo 1",
        description: "Documento con la DNI del testigo 1.",
        exampleDocument: "https://drive.google.com/file/d/1w-o-Ac4q3_chDpans1VCslmYkmdzPfWC/view"
    },
    [DocumentTypeAlumnos.DNI_TESTIGO_2]: {
        title: "Identificación del Testigo 2",
        description: "Documento con la DNI del testigo 2.",
        exampleDocument: "https://drive.google.com/file/d/1vhx5k627thovwOcwEeY4KoCYYvUDJlH3/view"
    },
    [DocumentTypeAlumnos.MONOGRAFIA]: {
        title: "Monografía",
        description: "Documento con la monografía del alumno.",
        exampleDocument: "https://drive.google.com/file/d/1w-o-Ac4q3_chDpans1VCslmYkmdzPfWC/view"
    },
    [DocumentTypeAlumnos.SOLICITUD_PRACTICA]: {
        title: "Solicitud de Práctica",
        description: "Documento para la supervisión de la práctica profesional.",
        exampleDocument: "https://storage.cloud.google.com/unicah_bucket/Gestion_Practicas/supervision-documents/reg-ps.501_solicitud_de_practica.pdf"
    },
    [DocumentTypeAlumnos.CONSTANCIA_TERMINACION]: {
        title: "Constancia de Finalización",
        description: "Documento para la terminación de la práctica profesional.",
        exampleDocument: "https://storage.cloud.google.com/unicah_bucket/Gestion_Practicas/supervision-documents/reg-ps.503_constancia_de_terminacion.pdf"
    }
};

export const Documents: Record<DocumentTypeAlumnos, Document> = {
    [DocumentTypeAlumnos.DATOS_GENERALES]: {
        fileTypeId: DocumentTypeAlumnos.DATOS_GENERALES,
        ...DocumentUserConfigMap[DocumentTypeAlumnos.DATOS_GENERALES],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeAlumnos.CARTA_ACEPTACION]: {
        fileTypeId: DocumentTypeAlumnos.CARTA_ACEPTACION,
        ...DocumentUserConfigMap[DocumentTypeAlumnos.CARTA_ACEPTACION],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeAlumnos.DNI_ALUMNO]: {
        fileTypeId: DocumentTypeAlumnos.DNI_ALUMNO,
        ...DocumentUserConfigMap[DocumentTypeAlumnos.DNI_ALUMNO],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeAlumnos.DNI_TESTIGO_1]: {
        fileTypeId: DocumentTypeAlumnos.DNI_TESTIGO_1,
        ...DocumentUserConfigMap[DocumentTypeAlumnos.DNI_TESTIGO_1],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeAlumnos.DNI_TESTIGO_2]: {
        fileTypeId: DocumentTypeAlumnos.DNI_TESTIGO_2,
        ...DocumentUserConfigMap[DocumentTypeAlumnos.DNI_TESTIGO_2],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeAlumnos.MONOGRAFIA]: {
        fileTypeId: DocumentTypeAlumnos.MONOGRAFIA,
        ...DocumentUserConfigMap[DocumentTypeAlumnos.MONOGRAFIA],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeAlumnos.CONSTANCIA_TERMINACION]: {
        fileTypeId: DocumentTypeAlumnos.CONSTANCIA_TERMINACION,
        ...DocumentUserConfigMap[DocumentTypeAlumnos.CONSTANCIA_TERMINACION],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeAlumnos.SOLICITUD_PRACTICA]: {
        fileTypeId: DocumentTypeAlumnos.SOLICITUD_PRACTICA,
        ...DocumentUserConfigMap[DocumentTypeAlumnos.SOLICITUD_PRACTICA],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    }
}