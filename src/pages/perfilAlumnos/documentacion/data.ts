import { Document } from "@pages/perfilAlumnos/documentacion/types";

export const Documents: Array<Document> = [
    {
        id: 1,
        title: "Datos Generales",
        description: "Documento con los datos generales del alumno.",
        file: "https://example.com/documento1.pdf",
        exampleDocument: "https://docs.google.com/document/d/1V_CSQgD4gmLfAYFN8qC8rpy80HdLVVVM/edit",
        status: 'pending'
    },
    {
        id: 2,
        title: "Carta de Aceptación",
        description: "Documento que acepta la solicitud del alumno para la practica profesional.",
        file: "https://example.com/documento2.pdf",
        exampleDocument: "https://drive.google.com/file/d/1gs8XPUoDcHMb2zAM41IlgjbycdjtE5-Z/view?pli=1",
        status: 'pending'
    },
    {
        id: 3,
        title: "Identificación del Alumno",
        description: "Documento con la DNI del alumno.",
        file: "https://example.com/documento3.pdf",
        exampleDocument: "https://drive.google.com/file/d/1T6GuMwFRMMF-G_cyT6Qg9rXLkcdaiE9X/view",
        status: 'pending'
    },
    {
        id: 4,
        title: "Identificación del Testigo 1",
        description: "Documento con la DNI del testigo 1.",
        file: "https://example.com/documento4.pdf",
        exampleDocument: "https://drive.google.com/file/d/1w-o-Ac4q3_chDpans1VCslmYkmdzPfWC/view",
        status: 'pending'
    },
    {
        id: 5,
        title: "Identificación del Testigo 2",
        description: "Documento con la DNI del testigo 2.",
        file: "https://example.com/documento5.pdf",
        exampleDocument: "https://drive.google.com/file/d/1vhx5k627thovwOcwEeY4KoCYYvUDJlH3/view",
        status: 'pending'
    },
    {
        id: 6,
        title: "Monografía",
        description: "Documento con la monografía del alumno.",
        file: "https://example.com/documento6.pdf",
        exampleDocument: "https://drive.google.com/file/d/1w-o-Ac4q3_chDpans1VCslmYkmdzPfWC/view",
        status: 'pending'
    }
]