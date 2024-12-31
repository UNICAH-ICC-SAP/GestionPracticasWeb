import { Type as TypeError } from "../../../Api/namespaces/modalError";
import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./_namespace";
import { getData, saveData, updateData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
  async getClases(params: TypeUtilities) {
    const response = await getData(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        clases: response?.data,
        error: response?.error,
      };
    }
    return {
      clases: response?.data,
      error: response?.error,
    };
  },

  async getCarreras(params: TypeUtilities) {
    const response = await getData(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        carreras: response?.data,
        error: response?.error,
      };
    }
    return {
      carreras: response?.data,
      error: response?.error,
    };
  },

  async insertClase(params: TypeUtilities) {
    const response = await saveData(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        clases: response?.data,
        error: response?.error,
        update: false,
      };
    }
    return {
      clases: response?.data,
      error: response?.error,
      update: false,
    };
  },

  async updateClase(params: TypeUtilities) {
    const response = await updateData(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        clases: response?.data,
        error: response?.error,
        update: false,
      };
    }
    return {
      clases: response?.data,
      error: response?.error,
      update: false,
    };
  },
});
