import 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        // 允许在请求配置中使用isEncrypt属性
        isEncryptResponse?: boolean;
        useDebounce?: boolean;
        debounceTime?: number;
    }
}