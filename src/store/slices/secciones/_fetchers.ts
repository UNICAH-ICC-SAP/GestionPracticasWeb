import { Type as TypeError } from "../../../Api/namespaces/modalError";
import { CreateFetchers } from "../../../storeConfig";
import { NAME } from "./_namespace";
import { deleteData, getData, saveData, updateData } from "../../../utilities/Utilities";
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
    const response = await saveData(params);
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

  async updateSeccion(params: TypeUtilities) {
    const response = await updateData(params);
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

  async deleteSection(params: TypeUtilities) {
    await deleteData(params);
  }
});
