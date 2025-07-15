import type {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import axios, { AxiosHeaders } from 'axios';
import Cookies from 'js-cookie';
import { decrypt, encrypt } from '../crypto';

// 扩展 AxiosRequestConfig 类型
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    encrypt?: boolean;
}

export interface ApiResponse<T = any> {
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
        // 添加 token
        const token = Cookies.get('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        // 加密请求数据 - 支持GET无参数、GET有参数和POST/PUT等请求
        const shouldEncrypt = config.encrypt;
        const isGetRequest = config.method?.toUpperCase() == 'GET';
        const hasData = config.data && Object.keys(config.data).length > 0;
        const hasParams = config.params && Object.keys(config.params).length > 0;

        if (shouldEncrypt) {
            try {
                let encryptedResult;

                // 处理GET请求
                if (isGetRequest) {
                    // GET请求有参数，加密参数
                    if (hasParams) {
                        encryptedResult = await encrypt(config.params);
                    }
                    // GET请求无参数，只生成加密参数
                    else {
                        encryptedResult = await encrypt();
                    }

                    // 将加密结果放入URL参数
                    config.params = {
                        encryptedData: encryptedResult.encryptedData || 0,
                        encryptedKey: encryptedResult.encryptedKey,
                        iv: encryptedResult.iv,
                        hashAlgorithm: encryptedResult.hashAlgorithm
                    };
                }
                // 处理其他请求方法
                else {
                    // 其他请求有数据，加密数据
                    if (hasData) {
                        encryptedResult = await encrypt(config.data);
                    }
                    // 其他请求无数据，只生成加密参数
                    else {
                        encryptedResult = await encrypt();
                    }

                    // 将加密结果放入请求体
                    config.data = {
                        encryptedData: encryptedResult.encryptedData || 0,
                        encryptedKey: encryptedResult.encryptedKey,
                        iv: encryptedResult.iv,
                        hashAlgorithm: encryptedResult.hashAlgorithm
                    };
                }

                // 设置加密标识
                config.headers.set('X-Request-Encrypted', 'true');
            } catch (error) {
                console.error('Encryption error:', error);
                return Promise.reject(new Error('数据加密失败'));
            }
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const isEncrypted = response.headers['x-response-encrypted'] == 'true';
        if (isEncrypted && response.data?.data) {
            try {
                if (
                    typeof response.data.data == 'object' &&
                    'encryptedData' in response.data.data
                ) {
                    const encryptedResponse = response.data.data as {
                        encryptedData: string;
                        iv: string
                    };

                    const decryptedData = decrypt(
                        encryptedResponse.encryptedData
                    );

                    try {
                        response.data.data = JSON.parse(decryptedData);
                    } catch {
                        response.data.data = decryptedData;
                    }
                } else {
                    throw new Error('无效的加密响应格式');
                }
            } catch (error) {
                console.error('Decrypt error:', error);
                return Promise.reject({
                    code: 500,
                    message: '数据解析失败',
                    data: null
                });
            }
        }

        return response;
    },
    (error: AxiosError) => {
        console.error('Response error:', error);

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