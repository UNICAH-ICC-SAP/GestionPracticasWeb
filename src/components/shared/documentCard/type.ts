import { DocumentStatus } from "@root/abstracts";

export type Document = {
    id: number;
    title: string;
    description: string;
    exampleDocument?: string;
    fileStatus: DocumentStatus | string;
    archivoId: number;
}

export type DocumentConfig = {
    title: string;
    description: string;
    exampleDocument: string;
};
