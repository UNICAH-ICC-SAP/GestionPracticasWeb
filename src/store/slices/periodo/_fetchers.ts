import { Type as TypeError } from '../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
import { saveData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

import { NAME } from "./_namespace";

export default CreateFetchers(NAME, {
    async insertNuevaCarga(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                nuevoPeriodo: response?.data, 
                error: response?.error,
            };
        }
        return {
            nuevoPeriodo: response?.data,
            error: response?.error,
        };
    },
});
