import { Type as TypeError } from '../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
/**SingleSelectoAccount */
import { NAME } from './_namespace';
import { getData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    /**Fetcher: Get singleSelectAccount service */
    async getDetalleTernas(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                detalleTernasInfo: response?.data,
                error: response?.error,
                logged: false
            };
        }
        return {
            detalleTernasInfo: response?.data,
            error: response?.error,
            logged: true
        };
    },
    async getTernasInfo(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                ternasInfo: response?.data,
                error: response?.error,
                logged: false
            };
        }
        return {
            ternasInfo: response?.data,
            error: response?.error,
            logged: true
        };
    }
});
