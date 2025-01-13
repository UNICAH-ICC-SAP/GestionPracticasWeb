import { Type as TypeError } from '../../../Api/namespaces/modalError';
import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./_namespace";
import { getData, saveData, updateData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    async getAcciontesPlantillas(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                accionesPlantillas: response?.data,
                error: response?.error,
            };
        }
        return {
            accionesPlantillas: response?.data,
            error: response?.error,
        };
    },
    async saveAccion(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                accione: null,
                error: response?.error,
                isSavedUser: false,
            };
        }
        return {
            accion: response?.data,
            error: response?.error,
            isSavedUser: true,
        };
    },
    async updateAccion(params: TypeUtilities) {
        const response = await updateData(params);
        if (isError<TypeError.ModalError>(response?.error)) {
            return {
                accion: response?.data,
                error: response?.error,
                isUpdated: false,
            };
        }
        return {
            accion: response?.data,
            error: response?.error,
            isUpdated: true,
        };
    },
});
