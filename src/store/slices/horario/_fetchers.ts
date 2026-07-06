import { Type as TypeError } from "../../../Api/namespaces/modalError";
import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./_namespace";
import { getData, Post, Delete } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
  async getHorario(params: TypeUtilities) {
    const response = await getData(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        disponibilidades: response?.data,
        error: response?.error,
      };
    }
    return {
      disponibilidades: response?.data,
      error: response?.error,
    };
  },

  async saveHorario(params: TypeUtilities) {
    const response = await Post(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        error: response?.error,
        update: false,
      };
    }
    return {
      error: response?.error,
      update: true,
    };
  },

  async deleteHorario(params: TypeUtilities) {
    const response = await Delete(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        error: response?.error,
        update: false,
      };
    }
    return {
      error: response?.error,
      update: true,
    };
  }
});
