import { CreateReducer } from "@root/storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {

    addCase(Action.cleanStore, () => ({
        ...INIT,
    }));
    addCase(Action.cleanAlumno, (state) => ({
        ...state,
        document: INIT.document,
    }));
    addCase(Fetcher.getDocuments.fulfilled, (state, { payload }) => ({
        ...state,
        documents: JSON.parse(JSON.stringify(payload.documents)),
    }));
    addCase(Fetcher.sendEmail.fulfilled, (state, { payload }) => ({
        ...state,
        isSavedUser: payload.isSavedUser
    }));
    addCase(Fetcher.saveDocument.fulfilled, (state, { payload }) => ({
        ...state,
        saveDataAlumno: JSON.parse(JSON.stringify(payload.document)),
        isSavedDocumentState: payload.isSavedDocumentState
    }));
    addCase(Fetcher.updatealumno.fulfilled, (state, { payload }) => ({
        ...state,
        alumnosActualizado: JSON.parse(JSON.stringify(payload.document)),
        error: JSON.parse(JSON.stringify(payload.error))
    }));

});
