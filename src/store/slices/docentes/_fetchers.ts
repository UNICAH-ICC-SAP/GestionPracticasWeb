import { Type as TypeError } from '../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
/**SingleSelectoAccount */
import { NAME } from "./_namespace";
import { LogIn, checkUser, getData, saveData, signUp, updateData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";
import { update } from 'lodash';

export default CreateFetchers(NAME, {
    /**Fetcher: Get singleSelectAccount service */
    async getDocentes(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                docentes: response?.data,
                error: response?.error,
            };
        }
        return {
            docentes: response?.data,
            error: response?.error,
        };
    },

    async updateDocente(params: TypeUtilities) {
        const response = await updateData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return{
                docente: response?.data,
                error: response?.error,
            };
        }
        return{
            docente: response?.data,
            error: response?.error,
        }
    },

    async insertDocente(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return{
                docente: response?.data,
                error: response?.error,
            };
        }
        return{
            docente: response?.data,
            error: response?.error,
        }
    },
    async insertUserDocente(params: TypeUtilities) {
        const response = await signUp(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return{
                docente: response?.data,
                error: response?.error,
            };
        }
        return{
            docente: response?.data,
            error: response?.error,
        }
    },
});
