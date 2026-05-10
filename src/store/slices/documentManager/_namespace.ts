import { Type as TypeModal } from '@api/namespaces/modalError';
import { AlumnoInfo } from "@api/namespaces/alumno";
import { CreateActions } from "@root/storeConfig";
import { DocumentStatus } from '@root/abstracts';

export const NAME = "DocumentManager";
export type ArchivoProvider = 'GCP';

export declare namespace Type {
    export type TypeUserFiles = {
        userId: string;
        userName: string;
        userFolder: string;
        files: TypeFile[];
    };

    export type TypeFile = {
        archivoId: number;
        originalName: string;
        storedName: string;
        mimeType: string;
        sizeBytes: number;
        provider: ArchivoProvider;
        bucketName: string;
        fileUrl: string;
        status: DocumentStatus;
        fileStatus: string;
        fileTypeId: number;
    };

    export type TypeCreatedSignedUrl = {
        message: string;
        file: TypeUploadSignedURL;
    };

    export type TypeUploadSignedURL = {
        archivoId: number;
        originalName: string;
        storedName: string;
        userFolder: string;
        uploadUrl: string;
        fileUrl: string;
    };

    export type TypeDownloadSignedUrlFile = {
        archivoId: number;
        originalName: string;
        downloadUrl: string;
    };
}

export declare namespace StoreDocumentManager {
    export type State = {
        selectedAlumno: AlumnoInfo | undefined;
        userFilesData: Type.TypeUserFiles | null;
        signedFilesUpload: Type.TypeUploadSignedURL | null;
        signedFilesDownload: Type.TypeDownloadSignedUrlFile | null;
        error: TypeModal.ModalError;
        isSavedState: boolean;
        isUpdatedStates: boolean;
        isRequestedChangesByDocente: boolean;
        message: string;
    };
}

export const Action = CreateActions<{
    cleanSignedFilesUpload: void;
    cleanStore: void;
    cleanSignedFilesDownload: void;
    cleanSelectedAlumno: void;
    setIsUpdate: boolean;
    setRequestedChangesByDocente: boolean;
    setSelectedAlumno: AlumnoInfo;
}>(NAME, ["cleanSignedFilesUpload", "cleanStore", "cleanSignedFilesDownload", "setIsUpdate", "setRequestedChangesByDocente", "setSelectedAlumno", "cleanSelectedAlumno"]);


export const INIT: StoreDocumentManager.State = {
    selectedAlumno: undefined,
    userFilesData: null,
    signedFilesUpload: null,
    signedFilesDownload: null,
    error: {
        code: 0,
        message: ""
    },
    isSavedState: false,
    isUpdatedStates: true,
    isRequestedChangesByDocente: false,
    message: "",
};