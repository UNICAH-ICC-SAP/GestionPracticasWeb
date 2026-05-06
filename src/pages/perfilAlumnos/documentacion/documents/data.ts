import type { Document, DocumentConfig } from "@components/shared/documentCard/type";
import { DocumentStatus, DocumentType } from "@root/abstracts";

export const DocumentTypeLabel = {
    [DocumentType.DATOS_GENERALES]: "Datos Generales",
    [DocumentType.CARTA_ACEPTACION]: "Carta de Aceptación",
    [DocumentType.DNI_ALUMNO]: "Identificación del Alumno",
    [DocumentType.DNI_TESTIGO_1]: "Identificación del Testigo 1",
    [DocumentType.DNI_TESTIGO_2]: "Identificación del Testigo 2",
    [DocumentType.MONOGRAFIA]: "Monografía",
    [DocumentType.SOLICITUD_PRACTICA]: "Solicitud de Práctica",
    [DocumentType.CONSTANCIA_TERMINACION]: "Constancia de Finalización",
};

export const DocumentUserConfigMap: Record<DocumentType, DocumentConfig> = {
    [DocumentType.DATOS_GENERALES]: {
        title: "Datos Generales",
        description: "Documento con los datos generales del alumno.",
        exampleDocument: "https://docs.google.com/document/d/1V_CSQgD4gmLfAYFN8qC8rpy80HdLVVVM/edit"
    },
    [DocumentType.CARTA_ACEPTACION]: {
        title: "Carta de Aceptación",
        description: "Documento que acepta la solicitud del alumno para la práctica profesional.",
        exampleDocument: "https://drive.google.com/file/d/1gs8XPUoDcHMb2zAM41IlgjbycdjtE5-Z/view"
    },
    [DocumentType.DNI_ALUMNO]: {
        title: "Identificación del Alumno",
        description: "Documento con la DNI del alumno.",
        exampleDocument: "https://drive.google.com/file/d/1T6GuMwFRMMF-G_cyT6Qg9rXLkcdaiE9X/view"
    },
    [DocumentType.DNI_TESTIGO_1]: {
        title: "Identificación del Testigo 1",
        description: "Documento con la DNI del testigo 1.",
        exampleDocument: "https://drive.google.com/file/d/1w-o-Ac4q3_chDpans1VCslmYkmdzPfWC/view"
    },
    [DocumentType.DNI_TESTIGO_2]: {
        title: "Identificación del Testigo 2",
        description: "Documento con la DNI del testigo 2.",
        exampleDocument: "https://drive.google.com/file/d/1vhx5k627thovwOcwEeY4KoCYYvUDJlH3/view"
    },
    [DocumentType.MONOGRAFIA]: {
        title: "Monografía",
        description: "Documento con la monografía del alumno.",
        exampleDocument: "https://drive.google.com/file/d/1w-o-Ac4q3_chDpans1VCslmYkmdzPfWC/view"
    },
    [DocumentType.SOLICITUD_PRACTICA]: {
        title: "Solicitud de Práctica",
        description: "Documento para la supervisión de la práctica profesional.",
        exampleDocument: "https://storage.cloud.google.com/unicah_bucket/Gestion_Practicas/supervision-documents/reg-ps.501_solicitud_de_practica.pdf"
    },
    [DocumentType.CONSTANCIA_TERMINACION]: {
        title: "Constancia de Finalización",
        description: "Documento para la terminación de la práctica profesional.",
        exampleDocument: "https://storage.cloud.google.com/unicah_bucket/Gestion_Practicas/supervision-documents/reg-ps.503_constancia_de_terminacion.pdf"
    }
};

export const Documents: Record<DocumentType, Document> = {
    [DocumentType.DATOS_GENERALES]: {
        id: DocumentType.DATOS_GENERALES,
        ...DocumentUserConfigMap[DocumentType.DATOS_GENERALES],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentType.CARTA_ACEPTACION]: {
        id: DocumentType.CARTA_ACEPTACION,
        ...DocumentUserConfigMap[DocumentType.CARTA_ACEPTACION],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentType.DNI_ALUMNO]: {
        id: DocumentType.DNI_ALUMNO,
        ...DocumentUserConfigMap[DocumentType.DNI_ALUMNO],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentType.DNI_TESTIGO_1]: {
        id: DocumentType.DNI_TESTIGO_1,
        ...DocumentUserConfigMap[DocumentType.DNI_TESTIGO_1],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentType.DNI_TESTIGO_2]: {
        id: DocumentType.DNI_TESTIGO_2,
        ...DocumentUserConfigMap[DocumentType.DNI_TESTIGO_2],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentType.MONOGRAFIA]: {
        id: DocumentType.MONOGRAFIA,
        ...DocumentUserConfigMap[DocumentType.MONOGRAFIA],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentType.CONSTANCIA_TERMINACION]: {
        id: DocumentType.CONSTANCIA_TERMINACION,
        ...DocumentUserConfigMap[DocumentType.CONSTANCIA_TERMINACION],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentType.SOLICITUD_PRACTICA]: {
        id: DocumentType.SOLICITUD_PRACTICA,
        ...DocumentUserConfigMap[DocumentType.SOLICITUD_PRACTICA],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    }
}