import { Type as TypeModal } from "../../../Api/namespaces/modalError";
import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./_namespace";
import { getData, saveData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
  async getPensum(params: TypeUtilities) {
    const response = await getData(params);
    if (isError<TypeModal.ModalError>(response?.error)) {
      return {
        pensum: response?.data,
        error: response?.error,
      };
    }
    return {
      pensum: response?.data,
      error: response?.error,
    };
  },

  async getCarreraBy(params: TypeUtilities) {
    const response = await getData(params);
    if (isError<TypeModal.ModalError>(response?.error)) {
      return {
        carrera: response?.data,
        error: response?.error,
      };
    }
    return {
      carrera: response?.data,
      error: response?.error,
    };
  },

  async insertClase(params: TypeUtilities) {
    const response = await saveData(params);
    if (isError<TypeModal.ModalError>(response?.error)) {
      return {
        clase: response?.data,
        error: response?.error,
      };
    }
    return {
      clase: response?.data,
      error: response?.error,
    };
  },

  async updateClase(params: TypeUtilities) {
    const response = await saveData(params);
    if (isError<TypeModal.ModalError>(response?.error)) {
      return {
        clase: response?.data,
        error: response?.error,
      };
    }
    return {
      clase: response?.data,
      error: response?.error,
    };
  },

  async updateStatus(params: TypeUtilities) {
    const response = await saveData(params);
    if (isError<TypeModal.ModalError>(response?.error)) {
      return {
        clase: response?.data,
        error: response?.error,
      };
    }
    return {
      clase: response?.data,
      error: response?.error,
    };
  }
});