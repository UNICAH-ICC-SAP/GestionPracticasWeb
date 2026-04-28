import { Type as TypeError } from '@api/namespaces/modalError';
import { CreateFetchers } from "@root/storeConfig";
import { NAME } from "./_namespace";
import { getData, saveData, updateData } from "@utilities/Utilities";
import { TypeUtilities } from "@utilities/TypeUtilities";
import { isError } from "@api/utilsError";

export default CreateFetchers(NAME, {
    /** Fetcher: Obtener todos los alumnos */
    async getDocuments(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                documents: response?.data,
                error: response?.error,
            };
        }
        return {
            documents: response?.data,
            error: response?.error,
        };
    },
    /** Fetcher: Obtener datos de un alumno */
    async getDocument(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                document: response?.data,
                error: response?.error,
            };
        }
        return {
            document: response?.data,
            error: response?.error,
        };
    },
    async sendEmail(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                document: null,
                error: response?.error,
                isSavedUser: false,
            };
        }
        return {
            document: response?.data,
            error: response?.error,
            isSavedUser: true,
        };
    },
    async saveDocument(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                document: null,
                error: response?.error,
                isSavedDocumentState: false,
            };
        }
        return {
            document: response?.data,
            error: response?.error,
            isSavedPlantillaState: true,
        };
    },
    async updatealumno(params: TypeUtilities) {
        const response = await updateData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                document: response?.data,
                error: response?.error,
            };
        }
        return {
            document: response?.data,
            error: response?.error,
        };
    },
});
