import { Type as TypeError } from "../../../Api/namespaces/modalError";
import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./_namespace";
import { Delete, getData, Post, Put } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
  async getSecciones(params: TypeUtilities) {
    const response = await getData(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        secciones: response?.data,
        error: response?.error,
      };
    }
    return {
      secciones: response?.data,
      error: response?.error,
    };
  },

  async insertSeccion(params: TypeUtilities) {
    const response = await Post(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        secciones: response?.data,
        error: response?.error,
        update: false,
      };
    }
    return {
      secciones: response?.data,
      error: response?.error,
      update: false,
    };
  },

  async updateSeccion(params: TypeUtilities) {
    const response = await Put(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        secciones: response?.data,
        error: response?.error,
        update: false,
      };
    }
    return {
      secciones: response?.data,
      error: response?.error,
      update: false,
    };
  },

  async deleteSection(params: TypeUtilities) {
    const response = await Delete(params);
    if (isError<TypeError.ModalError>(response?.error)) {
      return {
        secciones: response?.data,
        error: response?.error,
        update: false,
      };
    }
    return {
      secciones: response?.data,
      error: response?.error,
      update: false,
    };
  }
});
