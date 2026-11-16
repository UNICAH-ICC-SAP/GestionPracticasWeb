import { TypeUtilities, TypeGenericResponse } from "./TypeUtilities";
import axios, { AxiosRequestConfig } from "axios";
import { config, axiosGCP } from "./axiosConfig";

const api = axios.create(config);

api.interceptors.request.use(
    request => {
        const token = localStorage.getItem('SECURE');
        const path = (request.url || '').split('?')[0].replace(/\/$/, '');
        if (token && !['/user/login', '/user/activate'].includes(path)) {
            request.headers.set({ Authorization: `Bearer ${token}` });
        } else {
            request.headers.delete('Authorization');
        }
        return request;
    },
    error => Promise.reject(error)
);

async function requestData(options: AxiosRequestConfig): Promise<TypeGenericResponse> {
    try {
        const response = await api.request(options);
        return {
            singleData: Array.isArray(response.data) ? response.data[0] || {} : response.data || {},
            data: response.data,
            status: response.status,
            error: { code: 0, message: '' }
        };
    } catch (error) {
        const response = axios.isAxiosError(error) ? error.response : undefined;
        const serverMessage = response?.data?.message;
        return {
            singleData: {},
            data: [],
            status: response?.status || 503,
            error: {
                code: response?.status || 503,
                message: typeof serverMessage === 'string' && serverMessage
                    ? serverMessage
                    : response?.statusText || 'El servicio no está disponible.'
            }
        };
    }
}

function getData(props: TypeUtilities) {
    return requestData({ method: 'GET', url: props.url });
}

function getSingleData(props: TypeUtilities) {
    return getData(props);
}

function Post(props: TypeUtilities) {
    return requestData({ method: 'POST', url: props.url, data: props.data });
}

function Put(props: TypeUtilities) {
    return requestData({ method: 'PUT', url: props.url, data: props.data });
}

function Delete(props: TypeUtilities) {
    return requestData({ method: 'DELETE', url: props.url });
}

function PatchData(props: TypeUtilities) {
    return requestData({ method: 'PATCH', url: props.url, data: props.data });
}

function signUp(props: TypeUtilities) {
    return Post(props);
}

async function LogIn(props: TypeUtilities) {
    const response = await Post(props);
    const token = response.singleData['token'];
    if (!response.error.code && typeof token === 'string' && token) {
        localStorage.setItem('SECURE', token);
    } else {
        localStorage.removeItem('SECURE');
        if (!response.error.code) {
            response.status = 502;
            response.error = { code: 502, message: 'La respuesta de inicio de sesión no contiene un token válido.' };
        }
    }
    return response;
}

async function LogOut() {
    localStorage.removeItem('SECURE');
}

function checkUser() {
    return getData({ url: '/user/whoAmI' });
}

async function uploadToGCP(uploadUrl: string, file: File) {
    try {
        const response = await axiosGCP.put(uploadUrl, file, {
            headers: { "Content-Type": file.type }
        });
        return response.status === 200 || response.status === 204;
    } catch {
        return false;
    }
}

async function downloadFromGCP(downloadUrl: string, fileName: string) {
    const response = await axiosGCP.get(downloadUrl, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return response;
}

function getToken() {
    return Boolean(localStorage.getItem('SECURE'));
}

export {
    getData,
    getSingleData,
    Post,
    Delete,
    Put,
    PatchData,
    uploadToGCP,
    downloadFromGCP,
    LogIn,
    checkUser,
    getToken,
    LogOut,
    signUp
};