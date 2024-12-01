import { Type as TypeError } from '../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
/**SingleSelectoAccount */
import { NAME } from "./_namespace";
import { getData, updateData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    /**Fetcher: Get singleSelectAccount service */

    async getAlumnos(params: TypeUtilities) {
        const response = await getData(params);
        console.log(response, params);
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
    async deletealumno(params: TypeUtilities) {
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
    }
});

