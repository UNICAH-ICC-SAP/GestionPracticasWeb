import { Type as TypeError } from './../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
/**SingleSelectoAccount */
import { NAME } from "./_namespace";
import { getData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    /**Fetcher: Get singleSelectAccount service */
    async getFacultades(params: TypeUtilities) {
        console.log(params)
        const response = await getData(params);
        console.log(response)
        if (isError<TypeError.ModalError>(response?.error)) {
            console.log(response.error)
            return {
                facultades: response?.data,
                error: response?.error,
            };
        }
        return {
            facultades: response?.data,
            error: response?.error,
        };
    },
    async getFacultadesBy(params: TypeUtilities) {
        console.log(params)
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            console.log(response?.error)
            return {
                facultades: response?.data,
                error: response?.error,
            };
        }
        return {
            facultades: response?.data,
            error: response?.error,
        };
    },
});
