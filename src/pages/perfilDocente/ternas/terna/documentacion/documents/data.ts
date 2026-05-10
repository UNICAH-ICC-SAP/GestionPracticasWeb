import type { Document, DocumentConfig } from "@components/shared/documentCard/type";
import { DocumentStatus, DocumentTypeDocentes } from "@root/abstracts";

export const DocumentTypeDocentesLabel = {
    [DocumentTypeDocentes.MONOGRAFIA]: "Monografía",
    [DocumentTypeDocentes.SOLICITUD_PRACTICA]: "Solicitud de Práctica",
    [DocumentTypeDocentes.CONSTANCIA_TERMINACION]: "Constancia de Finalización",
};

export const DocumentUserConfigMap: Record<DocumentTypeDocentes, DocumentConfig> = {
    [DocumentTypeDocentes.MONOGRAFIA]: {
        title: "Monografía",
        description: "Documento con la monografía del alumno.",
        exampleDocument: "https://drive.google.com/file/d/1w-o-Ac4q3_chDpans1VCslmYkmdzPfWC/view"
    },
    [DocumentTypeDocentes.SOLICITUD_PRACTICA]: {
        title: "Solicitud de Práctica",
        description: "Documento para la supervisión de la práctica profesional.",
        exampleDocument: "https://storage.cloud.google.com/unicah_bucket/Gestion_Practicas/supervision-documents/reg-ps.501_solicitud_de_practica.pdf"
    },
    [DocumentTypeDocentes.CONSTANCIA_TERMINACION]: {
        title: "Constancia de Finalización",
        description: "Documento para la terminación de la práctica profesional.",
        exampleDocument: "https://storage.cloud.google.com/unicah_bucket/Gestion_Practicas/supervision-documents/reg-ps.503_constancia_de_terminacion.pdf"
    }
};

export const Documents: Record<DocumentTypeDocentes, Document> = {
    [DocumentTypeDocentes.MONOGRAFIA]: {
        fileTypeId: DocumentTypeDocentes.MONOGRAFIA,
        ...DocumentUserConfigMap[DocumentTypeDocentes.MONOGRAFIA],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeDocentes.CONSTANCIA_TERMINACION]: {
        fileTypeId: DocumentTypeDocentes.CONSTANCIA_TERMINACION,
        ...DocumentUserConfigMap[DocumentTypeDocentes.CONSTANCIA_TERMINACION],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    },
    [DocumentTypeDocentes.SOLICITUD_PRACTICA]: {
        fileTypeId: DocumentTypeDocentes.SOLICITUD_PRACTICA,
        ...DocumentUserConfigMap[DocumentTypeDocentes.SOLICITUD_PRACTICA],
        fileStatus: DocumentStatus.PENDING,
        archivoId: 0
    }
}