import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import axios, { AxiosHeaders } from 'axios';
import { encrypt_decrypt } from '../crypto';

const { encrypt, decrypt } = encrypt_decrypt();
interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
}

// 防抖缓存接口
interface DebounceCache {
    [key: string]: {
        timestamp: number;
        controller: AbortController;
    };
}

// 防抖缓存对象
const debounceCache: DebounceCache = {};

// 生成请求唯一标识
function generateRequestKey(config: InternalAxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`;
}

// 清除过期的防抖缓存
function clearExpiredDebounceCache(debounceTime: number = 1000) {
    const now = Date.now();
    Object.keys(debounceCache).forEach(key => {
        if (now - debounceCache[key].timestamp > debounceTime) {
            delete debounceCache[key];
        }
    });
}

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/base-api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

service.interceptors.request.use(
    async (config) => {
        if (!config.headers) {
            config.headers = new AxiosHeaders();
        }

        // const token = Cookies.get('token');
        // if (token) {
        //     config.headers.set('Authorization', `Bearer ${token}`);
        // }

        // 检查是否启用了防抖
        const useDebounce = config.useDebounce ?? true;
        const debounceTime = config.debounceTime ?? 1000; // 默认1秒防抖时间

        if (useDebounce) {
            // 清除过期缓存
            clearExpiredDebounceCache(debounceTime);

            // 生成请求唯一标识
            const requestKey = generateRequestKey(config);

            // 检查是否有相同的请求在防抖时间内
            if (debounceCache[requestKey]) {
                // 取消之前的请求
                debounceCache[requestKey].controller.abort('Request canceled due to debounce');
                delete debounceCache[requestKey];
            }

            // 创建新的AbortController并保存
            const controller = new AbortController();
            config.signal = controller.signal;
            debounceCache[requestKey] = {
                timestamp: Date.now(),
                controller
            };
        }

        const isEncryptResponse = config.isEncryptResponse || null;
        const requestData = config.data || config.params || null;

        try {
            let encryptedResult = await encrypt(requestData);
            if (config.data) {
                config.data = {
                    encryptedData: encryptedResult.encryptedData || 0,
                    encryptedKey: encryptedResult.encryptedKey,
                    iv: encryptedResult.iv,
                    hashAlgorithm: encryptedResult.hashAlgorithm,
                    isEncryptResponse
                };
            } else {
                config.params = {
                    encryptedData: encryptedResult.encryptedData || 0,
                    encryptedKey: encryptedResult.encryptedKey,
                    iv: encryptedResult.iv,
                    hashAlgorithm: encryptedResult.hashAlgorithm,
                    isEncryptResponse
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
        const { config } = response
        const isEncryptResponse = config.isEncryptResponse || null
        if (!isEncryptResponse) {
            return response.data.data;
        }
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
        // 如果是防抖取消的请求，特殊处理
        if (error.message === 'Request canceled due to debounce') {
            return Promise.reject({
                code: -1,
                message: '请求被防抖取消',
                data: null
            });
        }

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
                    window.location.href = '/login';
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