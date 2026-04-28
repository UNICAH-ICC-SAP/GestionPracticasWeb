import { StatusDocument } from '@root/abstracts';
import { Type as TypeModal } from '@api/namespaces/modalError';
import { CreateActions } from "@root/storeConfig";


export const NAME = "documentManager";

export declare namespace Type {
    export type DocumentInfo = {
        id: number;
        title: string;
        description: string;
        file: string;
        exampleDocument?: string;
        status: string;
        needsChange?: boolean;
    }
}

export declare namespace StoreDocumentManager {
    export type State = {
        document: Type.DocumentInfo;
        documents: Array<Type.DocumentInfo>;
        error: TypeModal.ModalError;
        isSavedState: boolean
    };
}

export const Action = CreateActions<{
    cleanAlumno: void;
    cleanStore: void;
}>(NAME, ["cleanAlumno", "cleanStore"]);


export const INIT: StoreDocumentManager.State = {
    document: {
        id: 0,
        title: "",
        description: "",
        file: "",
        exampleDocument: "",
        status: StatusDocument.PENDING,
        needsChange: false,
    },
    documents: [],
    error: {
        code: 0,
        message: ""
    },
    isSavedState: false,
};
