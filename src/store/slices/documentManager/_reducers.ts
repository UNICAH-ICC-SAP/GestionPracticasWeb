import { CreateReducer } from "@root/storeConfig";
import { INIT, Action } from "./_namespace";
import Fetcher from "./_fetchers";

export default CreateReducer(INIT, ({ addCase }) => {
    addCase(Action.cleanStore, () => ({
        ...INIT,
    }));
    addCase(Action.cleanSignedFilesUpload, (state) => ({
        ...state,
        signedFilesUpload: INIT.signedFilesUpload,
    }));

    addCase(Action.cleanSignedFilesDownload, (state) => ({
        ...state,
        signedFilesDownload: INIT.signedFilesDownload,
    }));

    addCase(Fetcher.getDocuments.fulfilled, (state, { payload }) => ({
        ...state,
        userFilesData: payload.documents?.data?.[0] ?? null,
        error: payload.error
    }));

    addCase(Fetcher.createSignedUrl.fulfilled, (state, { payload }) => ({
        ...state,
        signedFilesUpload: payload.signedUrl?.file ?? null,
        isSavedState: false,
        error: payload.error
    }));

    addCase(Fetcher.createUpdateSignedUrl.fulfilled, (state, { payload }) => ({
        ...state,
        signedFilesUpload: payload.signedUrl?.file ?? null,
        isSavedState: false,
        error: payload.error
    }));

    addCase(Fetcher.updateStatus.fulfilled, (state, { payload }) => ({
        ...state,
        isUpdatedStates: payload.updated,
        message: payload.updated ? null : state.message,
        error: payload.error
    }));

    addCase(Fetcher.getDownloadSignedUrl.fulfilled, (state, { payload }) => ({
        ...state,
        signedFilesDownload: payload.downloadFile ?? null,
        error: payload.error
    }));

    addCase(Fetcher.uploadDocument.fulfilled, (state, { payload }) => ({
        ...state,
        isSavedState: payload.uploaded,
        message: payload.uploaded ? null : state.message,
        error: payload.error,
    }));

    addCase(Action.setIsUpdate, (state, { payload }) => ({
        ...state,
        isUpdatedStates: payload,
    }));

    addCase(Action.setRequestedChangesByDocente, (state, { payload }) => ({
        ...state,
        isRequestedChangesByDocente: payload,
    }))

});
