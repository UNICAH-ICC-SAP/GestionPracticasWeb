import { Type as TypeError } from '../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./_namespace";
import { getData, saveData, updateData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    /** Fetcher: Obtener todos los alumnos */
    async getAlumnos(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                alumnos: response?.data,
                error: response?.error,
            };
        }
        return {
            alumnos: response?.data,
            error: response?.error,
        };
    },
    /** Fetcher: Obtener datos de un alumno */
    async getAlumno(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                alumnos: response?.data,
                error: response?.error,
            };
        }
        return {
            alumno: response?.data,
            error: response?.error,
        };
    },
    async saveDataUser(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                alumno: null,
                error: response?.error,
                isSavedUser: false,
            };
        }
        return {
            alumno: response?.data,
            error: response?.error,
            isSavedUser: true,
        };
    },
    async saveDataAlumno(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                alumno: null,
                error: response?.error,
                isSavedAlumno: false,
            };
        }
        return {
            alumno: response?.data,
            error: response?.error,
            isSavedAlumno: true,
        };
    },
    async updatealumno(params: TypeUtilities) {
        const response = await updateData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                alumnos: response?.data,
                error: response?.error,
            };
        }
        return {
            alumnos: response?.data,
            error: response?.error,
        };
    },
});
