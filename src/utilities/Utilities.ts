import { TypeUtilities, TypeGenericResponse, INIT } from "./TypeUtilities";
import axios from "axios";
import { config } from "./axiosConfig";
import { isEmpty } from "lodash";
const api = axios.create(config);

const responseData: TypeGenericResponse = INIT;

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
    try {
        return await api.get(props.url).then(response => {
            if (response['status'] === 401) {
                responseData.status = 401;
                return responseData
            };
            responseData.data = response.data;
            responseData.status = response.status;
            return responseData;
        }).catch(error => {
            const response = error["response"];
            if (response["status"] === 401 || response["status"] === 404) {
                responseData.error.code = parseInt(response["status"], 10);
                responseData.error.message = response["statusText"];
                return responseData;
            }
            responseData.error.code = 503;
            responseData.error.message = error["statusText"];
            return responseData;
        });
    } catch (err) {
        console.error(err);
    }
};

async function getSingleData(props: TypeUtilities) {
    try {
        return await api.get(props.url).then(response => {
            const dataArray = response.data;
            if (response['status'] === 401) {
                responseData.status = 401;
                return responseData
            };
            responseData.singleData = dataArray[0];
            responseData.status = response.status;
            return responseData;
        }).catch(error => {
            const response = error["response"];
            if (response["status"] === 401 || response["status"] === 404) {
                responseData.error.code = parseInt(response["status"], 10);
                responseData.error.message = response["statusText"];
                return responseData;
            }
            responseData.error.code = 503;
            responseData.error.message = error["statusText"];
            return responseData;
        });
    } catch (err) {
        console.error(err);
    }
};

async function saveData(props: TypeUtilities) {
    try {
        const { data } = props;
        return await api.post(props.url, data)
            .then(response => {
                if (response['status'] === 401) {
                    responseData.status = 401;
                    return responseData
                };
                responseData.data = response.data;
                responseData.status = response.status;
                return responseData;
            })
            .catch(error => {
                const response = error["response"];
                if (response["status"] === 401 || response["status"] === 404) {
                    responseData.error.code = parseInt(response["status"], 10);
                    responseData.error.message = response["statusText"];
                    return responseData;
                }
                responseData.error.code = 503;
                responseData.error.message = error["statusText"];
                return responseData;
            });
    } catch (error) {
        console.error(error)
    }
}

async function updateData(props: TypeUtilities) {
    try {
        if (config.headers) {
            config.headers['content-type'] = 'application/x-www-form-urlencoded'
        }
        const { data } = props;
        return await api.put(props.url, data)
            .then(response => {
                if (response['status'] === 401) {
                    responseData.status = 401;
                    return responseData
                };
                responseData.data = response.data;
                responseData.status = response.status;
                return responseData;
            })
            .catch(error => {
                const response = error["response"];
                if (response["status"] === 401 || response["status"] === 404) {
                    responseData.error.code = parseInt(response["status"], 10);
                    responseData.error.message = response["statusText"];
                    return responseData;
                }
                responseData.error.code = 503;
                responseData.error.message = error["statusText"];
                return responseData;
            });
    } catch (error) {
        console.error(error)
    }
}

async function deleteData(props: TypeUtilities) {
    try {
        return await api.delete(props.url)
            .then(response => {
                return response.status;
            })
            .catch(error => { return { message: error } });
    } catch (error) {
        console.error(error)
    }
}

async function signUp(props: TypeUtilities) {
    try {
        const { data } = props;
        return await api.post(props.url, data)
            .then(response => {
                if (response['status'] === 401) {
                    responseData.status = 401;
                    return responseData
                };
                responseData.data = response.data;
                responseData.status = response.status;
                return responseData;
            })
            .catch(error => {
                const response = error["response"];
                if (response["status"] === 401 || response["status"] === 404) {
                    responseData.error.code = parseInt(response["status"], 10);
                    responseData.error.message = response["statusText"];
                    return responseData;
                }
                responseData.error.code = 503;
                responseData.error.message = error["statusText"];
                return responseData;
            });
    } catch (error) {
        console.log(error)
    }
}

async function LogIn(props: TypeUtilities) {
    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    delete api.defaults.headers.common['Authorization'];
    try {
        const { data, url } = props;
        return await api.post(url, data)
            .then(response => {
                if (response['status'] === 401) {
                    responseData.status = 401;
                    return responseData
                };
                responseData.singleData = response.data;
                responseData.status = response.status;
                localStorage.setItem('SECURE', responseData.singleData["token"]);
                return responseData;
            })
            .catch(error => {
                const response = error["response"];
                if (response["status"] === 401 || response["status"] === 404) {
                    responseData.error.code = parseInt(response["status"], 10);
                    responseData.error.message = response["statusText"];
                    return responseData;
                }
                responseData.error.code = 503;
                responseData.error.message = error["statusText"];
                return responseData;
            });
    } catch (error) {
        console.error(error)
    }
}

async function LogOut() {
    localStorage.clear();
}

async function checkUser() {
    if (config.headers) {
        config.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    try {
        return await api.get('/user/whoami')
            .then(response => {
                if (response.status === 200) {
                    responseData.data = response.data;
                    responseData.status = response.status;
                    return responseData;
                } else {
                    responseData.error.code = 500;
                    responseData.error.message = "Error de Autenticacion";
                    return responseData
                }
            }).catch(error => {
                const response = error["response"]
                if (response["status"] === 401 || response["status"] === 404) {
                    responseData.error.code = response["status"];
                    responseData.error.message = response["statusText"];
                    return responseData;
                }
                responseData.error.code = 503;
                responseData.error.message = error["message"];
                return responseData;
            })
    } catch (error) {
        console.error('catch', error)
    }
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
    saveData,
    deleteData,
    updateData,
    LogIn,
    checkUser,
    getToken,
    LogOut,
    signUp
};
