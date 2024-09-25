import { Type as TypeError } from './../../../Api/namespaces/errorService';
import { CreateFetchers } from "../../../storeConfig";
/**SingleSelectoAccount */
import { NAME } from "./_namespace";
import { LogIn, checkUser, getData, getToken } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";

export default CreateFetchers(NAME, {
    /**Fetcher: Get singleSelectAccount service */
    async login(params: TypeUtilities) {
        console.log(params)
        const response = await LogIn(params);
        if (isError<TypeError.ErrorSchema>(response?.error)) {
            console.log(response?.error)
            return {
                user: response?.singleData,
                error: response?.error,
                logged: false
            };
        }
        return {
            user: response?.singleData,
            error: response?.error,
            logged: true
        };
    },
    async checkUserLogged(params: string) {
        const response = await checkUser();
        if (isError<TypeError.ErrorSchema>(response?.error)) {
            console.log(response?.error)
            return {
                user: response?.data,
                error: response?.error,
                logged: false
            };
        }
        return {
            user: response?.data,
            error: response?.error,
            logged: true
        };
    },
    async userInfo(params: TypeUtilities) {
        const response = await getData(params);
        if (isError<TypeError.ErrorSchema>(response?.error)) {
            console.log(response?.error)
            return {
                user: response?.data,
                error: response?.error,
                logged: false
            };
        }
        return {
            user: response?.data,
            error: response?.error,
            logged: true
        };
    },
    async validateSession(params: TypeUtilities) {
        const hasToken = getToken();
        if (!hasToken) { return { user: {}, error: {}, logged: false } }
        return { user: {}, error: {}, logged: true }
    }
});
