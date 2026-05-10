import { DocumentStatus } from "@root/abstracts";

export type Document = {
    archivoId: number;
    title: string;
    description: string;
    exampleDocument?: string;
    fileStatus: DocumentStatus | string;
    fileTypeId: number;
}

export type DocumentConfig = {
    title: string;
    description: string;
    exampleDocument: string;
};
