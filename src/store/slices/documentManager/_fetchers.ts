import { Type as TypeError } from '@api/namespaces/modalError';
import { CreateFetchers } from "@root/storeConfig";
import { NAME } from "./_namespace";
import { Post, PatchData, uploadToGCP } from "@utilities/Utilities";
import { TypeUtilities } from "@utilities/TypeUtilities";
import { isError } from "@api/utilsError";
import { InfoFile } from '@api/namespaces/files';

export default CreateFetchers(NAME, {
    /** Fetcher: Obtener todos los alumnos */
    async getDocuments(params: TypeUtilities) {
        const response = await Post(params);

        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                documents: null,
                error: response?.error,
            };
        }

        return {
            documents: response?.data as unknown as InfoFile,
            error: response?.error,
        };
    },

    async createSignedUrl(params: TypeUtilities) {
        const response = await Post(params);

        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                signedUrl: null,
                error: response?.error,
            };
        }

        return {
            signedUrl: response?.data,
            error: response?.error,
        };
    },

    async createUpdateSignedUrl(params: TypeUtilities) {
        const response = await Post(params);

        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                signedUrl: null,
                error: response?.error,
            };
        }

        return {
            signedUrl: response?.data,
            error: response?.error,
        };
    },

    async getDownloadSignedUrl(params: TypeUtilities) {
        const response = await Post(params);

        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                downloadFile: null,
                error: response?.error,
            };
        }

        return {
            downloadFile: response?.data,
            error: response?.error,
        };
    },

    async updateStatus(params: TypeUtilities) {
        const response = await PatchData(params);
        if (!response) {
            return {
                uploaded: false,
                error: response?.error,
            };
        }
        return {
            uploaded: true,
            error: response?.error,
        };
    },

    async uploadDocument(params: TypeUtilities) {
        const response = await uploadToGCP(params.url, params.data as File);
        if (!response) {
            return {
                uploaded: false,
                error: response,
            };
        }
        return {
            uploaded: true,
            error: response,
        };
    },
});
