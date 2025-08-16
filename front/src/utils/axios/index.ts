import { encrypt_decrypt } from '@/utils/crypto';
import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import axios, { AxiosHeaders } from 'axios';
import { messageFunctions } from '../messages';

const { showError } = messageFunctions();
const { encrypt, decrypt } = encrypt_decrypt();

interface ApiResponse<T = any> {
    code?: number;
    data?: T;
    message?: string;
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

// 优化：排序对象键，避免顺序影响
function sortObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(sortObject);
    return Object.keys(obj).sort().reduce((res, key) => {
        res[key] = sortObject(obj[key]);
        return res;
    }, {} as any);
}

// 生成请求唯一标识
function generateRequestKey(config: InternalAxiosRequestConfig): string {
    const { method, url, params, data } = config;
    const sortedParams = sortObject(params);
    const sortedData = sortObject(data);
    return `${method}-${url}-${JSON.stringify(sortedParams)}-${JSON.stringify(sortedData)}`;
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
                debounceCache[requestKey].controller.abort('cancel');
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

        const isEncryptResponse = config.isEncryptResponse;
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
    (response: AxiosResponse) => {
        const { config } = response
        const isEncryptResponse = config.isEncryptResponse || null

        if (!isEncryptResponse) {
            return response.data;
        }
        if (response.data?.data) {
            try {
                const encryptedResponse = response.data.data
                const decryptedData = decrypt(
                    encryptedResponse
                );
                try {
                    response.data.data = JSON.parse(decryptedData);
                } catch {
                    response.data.data = decryptedData;
                }
            } catch (error) {
                return Promise.reject({
                    code: -1,
                    message: '响应数据解析失败'
                });
            }
        }

        return response.data;
    },
    (error: AxiosError) => {
        // 处理防抖取消的请求
        if (error.message === 'canceled') {
            return Promise.reject({
                code: -1,
                message: '请求被防抖取消'
            });
        }

        if (error.response) {
            const { status, data } = error.response as any;

            // 未授权
            if (status === 401) {
                window.location.href = '/login';
                return Promise.reject({
                    code: data?.code || 401,
                    message: data?.message || '登录已过期，请重新登录'
                });
            }

            // 403 权限不足
            if (status === 403) {
                return Promise.reject({
                    code: data?.code || 403,
                    message: data?.message || '权限不足'
                });
            }

            // 404 资源不存在
            if (status === 404) {
                return Promise.reject({
                    code: data?.code || 404,
                    message: data?.message || '资源不存在'
                });
            }

            // 5xx 服务器错误
            if (status >= 500) {
                return Promise.reject({
                    code: data?.code || 500,
                    message: data?.message
                });
            }

            if (data?.message) {
                showError(data?.message)
            }
        }

        // 处理无响应的错误（如网络中断）
        if (!error.response) {
            showError('网络连接失败，请检查网络')
            return Promise.reject({
                code: -2,
                message: '网络异常'
            });
        }

        // 其他未处理的错误
        showError('请求失败，请稍后重试')
        return Promise.reject(error)
    }
);

export default service;