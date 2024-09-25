import { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_URL_API,
    headers: {
        'content-type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
}

export { config };
