import { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_URL_API,
    headers: {
        'content-type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
}

import axios from "axios";

export const axiosGCP = axios.create({
    baseURL: "", // ⚠️ importante: sin baseURL
    headers: {}  // sin headers globales
});

export { config, axios };
