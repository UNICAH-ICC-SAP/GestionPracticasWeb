import { TypeUtilities, TypeGenericResponse, INIT } from "./TypeUtilities";
import axios from "axios";
import { config, axiosGCP } from "./axiosConfig";
import { isEmpty } from "lodash";
const api = axios.create(config);

function freshResponse(): TypeGenericResponse {
    return JSON.parse(JSON.stringify(INIT));
}

api.interceptors.request.use(
    async config => {
        const TOKEN = localStorage.getItem('SECURE')
        if (TOKEN) {
            config.headers.set({ 'Authorization': `Bearer ${TOKEN}` })
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

async function getData(props: TypeUtilities) {
    const res = freshResponse();
    return await api.get(props.url).then(response => {
        if (response['status'] === 401) {
            res.status = 401;
            return res
        };
        res.data = response.data;
        res.status = response.status;
        return res;
    }).catch(error => {
        const response = error["response"];
        if (response && (response["status"] === 401 || response["status"] === 404)) {
            res.error.code = parseInt(response["status"], 10);
            res.error.message = response["statusText"];
            return res;
        }
        res.error.code = 503;
        res.error.message = error["statusText"];
        return res;
    });
};

async function getSingleData(props: TypeUtilities) {
    const res = freshResponse();
    return await api.get(props.url).then(response => {
        const dataArray = response.data;
        if (response['status'] === 401) {
            res.status = 401;
            return res
        };
        res.singleData = dataArray[0];
        res.status = response.status;
        return res;
    }).catch(error => {
        const response = error["response"];
        if (response && (response["status"] === 401 || response["status"] === 404)) {
            res.error.code = parseInt(response["status"], 10);
            res.error.message = response["statusText"];
            return res;
        }
        res.error.code = 503;
        res.error.message = error["statusText"];
        return res;
    });
};

// Descarga archivos binarios (PDF, etc.) usando la misma instancia autenticada `api`.
// Devuelve el Blob si todo sale bien, o null si falla (revisa la consola para el detalle).
async function getBlobFile(props: TypeUtilities): Promise<Blob | null> {
    try {
        const response = await api.get(props.url, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        return null;
    }
}

async function Post(props: TypeUtilities) {
    const res = freshResponse();
    const { data } = props;
    return await api.post(props.url, data)
        .then(response => {
            if (response['status'] === 401) {
                res.status = 401;
                return res
            };
            res.data = response.data;
            res.status = response.status;
            return res;
        })
        .catch(error => {
            const response = error["response"];
            if (response) {
                res.error.code = parseInt(response["status"], 10);
                res.error.message = response["data"]?.message || response["statusText"];
                return res;
            }
            res.error.code = 503;
            res.error.message = error["message"] || "Error de conexión";
            return res;
        });
}

async function Put(props: TypeUtilities) {
    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    const res = freshResponse();
    const { data } = props;
    return await api.put(props.url, data)
        .then(response => {
            if (response['status'] === 401) {
                res.status = 401;
                return res
            };
            res.data = response.data;
            res.status = response.status;
            return res;
        })
        .catch(error => {
            const response = error["response"];
            if (response) {
                res.error.code = parseInt(response["status"], 10);
                res.error.message = response["data"]?.message || response["statusText"];
                return res;
            }
            res.error.code = 503;
            res.error.message = error["message"] || "Error de conexión";
            return res;
        });
}

async function Delete(props: TypeUtilities) {
    const res = freshResponse();
    return await api.delete(props.url)
        .then(response => {
            if (response['status'] === 200) {
                res.status = 200;
                return res
            };
            res.data = response.data;
            res.status = response.status;
            return res;
        })
        .catch(error => {
            const response = error["response"];
            if (response && (response["status"] === 401 || response["status"] === 404)) {
                res.error.code = parseInt(response["status"], 10);
                res.error.message = response["statusText"];
                return res;
            }
            res.error.code = 503;
            res.error.message = error["statusText"];
            return res;
        });
}

async function PatchData(props: TypeUtilities) {
    const res = freshResponse();
    const { data } = props;
    return await api.patch(props.url, data)
        .then(response => {
            res.data = response.data;
            res.status = response.status;
            return res;
        })
        .catch(error => {
            const response = error["response"];

            if (response) {
                res.error.code = parseInt(response["status"], 10);
                res.error.message = response["statusText"];
                return res;
            }

            res.error.code = 503;
            res.error.message = "Servicio no disponible";
            return res;
        });
}

async function signUp(props: TypeUtilities) {
    const res = freshResponse();
    const { data } = props;
    return await api.post(props.url, data)
        .then(response => {
            if (response['status'] === 401) {
                res.status = 401;
                return res
            };
            res.data = response.data;
            res.status = response.status;
            return res;
        })
        .catch(error => {
            const response = error["response"];
            if (response && (response["status"] === 401 || response["status"] === 404)) {
                res.error.code = parseInt(response["status"], 10);
                res.error.message = response["statusText"];
                return res;
            }
            res.error.code = 503;
            res.error.message = error["statusText"];
            return res;
        });
}

async function LogIn(props: TypeUtilities) {
    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    delete api.defaults.headers.common['Authorization'];
    const res = freshResponse();
    const { data, url } = props;
    return await api.post(url, data)
        .then(response => {
            if (response['status'] === 401) {
                res.status = 401;
                return res
            };
            res.singleData = response.data;
            res.status = response.status;
            localStorage.setItem('SECURE', res.singleData["token"]);
            return res;
        })
        .catch(error => {
            const response = error["response"];
            if (response && (response["status"] === 401 || response["status"] === 404)) {
                res.error.code = parseInt(response["status"], 10);
                res.error.message = response["statusText"];
                return res;
            }
            res.error.code = 503;
            res.error.message = error["statusText"];
            return res;
        });
}

async function LogOut() {
    localStorage.clear();
}

async function checkUser() {
    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    const res = freshResponse();
    return await api.get('/user/whoami')
        .then(response => {
            if (response.status === 200) {
                res.data = response.data;
                res.status = response.status;
                return res;
            } else {
                res.error.code = 500;
                res.error.message = "Error de Autenticacion";
                return res
            }
        }).catch(error => {
            const response = error["response"]
            if (response && (response["status"] === 401 || response["status"] === 404)) {
                res.error.code = response["status"];
                res.error.message = response["statusText"];
                return res;
            }
            res.error.code = 503;
            res.error.message = error["message"];
            return res;
        })
}

async function uploadToGCP(uploadUrl: string, file: File) {
    const response = await axiosGCP.put(uploadUrl, file, {
        headers: {
            "Content-Type": file.type
        }
    });

    return response.status === 200 || response.status === 204;
}

async function downloadFromGCP(downloadUrl: string, fileName: string) {
    const response = await axiosGCP.get(downloadUrl, {
        responseType: "blob"
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

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
    const tokenStored = localStorage.getItem('SECURE');
    if (!isEmpty(tokenStored)) {
        return true
    } else {
        return false
    }
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
    signUp,
    getBlobFile
};