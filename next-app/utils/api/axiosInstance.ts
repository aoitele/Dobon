import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const axiosInstance = (options?: AxiosRequestConfig) => {
   
    const client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL || `http://0.0.0.0:${process.env.PORT}`,
        timeout: Number(process.env.AXIOS_CONFIG_TIMEOUT) || 3000,
        responseType: 'json'
    });

    client.interceptors.request.use(config => {
        if (options?.headers) {
            for (const key of Object.keys(options.headers)) {
                config.headers.common[key] = options.headers[key]
            }
        }
        return config;
    })
    
    client.interceptors.response.use(
        response => onSuccess(response),
        error => onError(error) 
    );

    const onSuccess = (response: any) => response
    const onError = (error: AxiosResponse<any>) => Promise.reject(error)

    return {
        client,
        get: <T = any, R = AxiosResponse<T>>(url:string): Promise<R> => client.get(url),
        post: <T = any, R = AxiosResponse<T>> (url: string, data: Record<string, unknown>): Promise<R> => client.post(url, data)
    }
}
export default axiosInstance