import { Type as TypeError } from '../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
/**SingleSelectoAccount */
import { NAME } from "./_namespace";
import { LogIn, checkUser, getData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

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
});
