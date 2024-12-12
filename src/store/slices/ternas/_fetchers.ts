import { Type as TypeError } from '../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
import { NAME } from './_namespace';
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";
import { getData, saveData} from "../../../utilities/Utilities";

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
    },
    async saveDetalleTernas (params: TypeUtilities){
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                detalleTernas: response?.data,
                error: response?.error,
                logged: false
            };
        }
        return {
            detalleTernas: response?.data,
            error: response?.error,
            logged: true
        };
    },
    async saveTernas (params: TypeUtilities){
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                ternaInfo: response?.data['ternaId'].toString(),
                error: response?.error,
                logged: false
            };
        }
        console.log(response?.data)
        return {
            ternaInfo: response?.data['ternaId'].toString(),
            error: response?.error,
            logged: true
        };
    },
});
