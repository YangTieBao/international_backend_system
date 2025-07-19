import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import axios, { AxiosHeaders } from 'axios';
import Cookies from 'js-cookie';
import { encrypt_decrypt } from '../crypto';

const { encrypt, decrypt } = encrypt_decrypt();

// 扩展 AxiosRequestConfig 类型
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {

}

interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
}

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

service.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
        if (!config.headers) {
            config.headers = new AxiosHeaders();
        }

        const token = Cookies.get('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        const requestData = config.data || config.params || null

        try {
            let encryptedResult = await encrypt(requestData);
            if (config.data) {
                config.data = {
                    encryptedData: encryptedResult.encryptedData || 0,
                    encryptedKey: encryptedResult.encryptedKey,
                    iv: encryptedResult.iv,
                    hashAlgorithm: encryptedResult.hashAlgorithm
                };
            } else {
                config.params = {
                    encryptedData: encryptedResult.encryptedData || 0,
                    encryptedKey: encryptedResult.encryptedKey,
                    iv: encryptedResult.iv,
                    hashAlgorithm: encryptedResult.hashAlgorithm
                };
            }
        } catch (error) {
            return Promise.reject(new Error('数据加密失败'));
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        if (response.data?.data?.data) {
            try {
                const encryptedResponse = response.data.data.data
                const decryptedData = decrypt(
                    encryptedResponse
                );
                try {
                    response.data.data.data = JSON.parse(decryptedData);
                } catch {
                    response.data.data.data = decryptedData;
                }
            } catch (error) {
                return Promise.reject({
                    code: 500,
                    message: '数据解析失败',
                    data: null
                });
            }
        }

        return response.data.data;
    },
    (error: AxiosError) => {

        // 创建错误响应对象
        const errorResponse: ApiResponse = {
            code: error.response?.status || 500,
            message: error.message,
            data: null
        };

        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    Cookies.remove('token');
                    window.location.href = '/index';
                    errorResponse.message = '未授权，请重新登录';
                    break;
                case 403:
                    errorResponse.message = '权限不足';
                    break;
                case 500:
                    errorResponse.message = '服务器错误';
                    break;
                default:
                    errorResponse.message = `请求错误: ${status}`;
            }

            // 如果后端返回了自定义错误消息
            if (error.response.data && typeof error.response.data == 'object') {
                const serverError = error.response.data as any;
                if (serverError.message) {
                    errorResponse.message = serverError.message;
                }
            }
        } else if (error.request) {
            errorResponse.message = '网络错误，请检查网络连接';
        } else {
            errorResponse.message = '请求配置错误';
        }

        return Promise.reject(errorResponse);
    }
);

export default service;