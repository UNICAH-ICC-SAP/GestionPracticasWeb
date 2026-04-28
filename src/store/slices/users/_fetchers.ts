import { Type as TypeError } from './../../../Api/namespaces/errorService';
import { CreateFetchers } from "../../../storeConfig";
/**SingleSelectoAccount */
import { NAME } from "./_namespace";
import { LogIn, checkUser, getData, getToken, saveData, signUp, updateData } from "../../../utilities/Utilities";
import { TypeUtilities } from "../../../utilities/TypeUtilities";
import { isError } from "../../../Api/utilsError";
import { RolesTypeResponse, TypePermissionResponse } from "@api/namespaces/roles"
import { TypeLoginResponse } from '@api/namespaces/user';

export default CreateFetchers(NAME, {
    /**Fetcher: Get singleSelectAccount service */
    async getRolesPermissionByUserRole(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ErrorSchema>(response?.error)) {
            return {
                roles: [],
                error: response?.error,
                logged: false
            };
        }

        const dataResponse = response.data[0] as unknown as RolesTypeResponse;

        const roles = dataResponse?.permissions?.map(permission => ({
            permissionId: permission.permissionId,
            permission: permission.name
        })) || [];

        return {
            roles,
            error: response?.error,
            logged: true
        };
    },
    async getUserPermissionByUser(params: TypeUtilities) {
        const response = await saveData(params);
        if (isError<TypeError.ErrorSchema>(response?.error)) {
            return {
                permissions: [],
                error: response?.error,
                logged: false
            };
        }

        const dataResponse = response.data as unknown as TypePermissionResponse;

        const permissions = dataResponse?.permissions?.map(permission => ({
            permissionId: permission.permissionId,
            permission: permission.permission,
            permissionType: permission.type,
        })) || [];
        return {
            permissions,
            error: response?.error,
            logged: true
        };
    },
    async login(params: TypeUtilities) {
        const response = await LogIn(params);
        if (isError<TypeError.ErrorSchema>(response?.error)) {
            return {
                user: {},
                error: response?.error,
                logged: false,
                passwordResetRequired: false
            };
        }

        return {
            user: response?.singleData as unknown as TypeLoginResponse,
            error: response?.error,
            logged: true,
            passwordResetRequired: response?.singleData["passwordResetRequired"]
        };
    }
    ,
    async checkUserLogged() {
        const response = await checkUser();
        if (isError<TypeError.ErrorSchema>(response?.error)) {
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
    async validateSession() {
        const hasToken = getToken();
        if (!hasToken) { return { user: {}, error: {}, logged: false } }
        return { user: {}, error: {}, logged: true }
    },
    async signUp(params: TypeUtilities) {
        const response = await signUp(params);
        if (isError<TypeError.ErrorSchema>(response?.error)) {
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
    async updateData(params: TypeUtilities) {
        const response = await updateData(params);

        if (isError<TypeError.ErrorSchema>(response?.error)) {
            return {
                data: null,
                error: response?.error,
                success: false
            };
        }

        return {
            data: response?.singleData,
            error: null,
            success: true
        };
    }
});
