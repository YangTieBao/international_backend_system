import 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        // 允许在请求配置中使用encrypt属性
        encrypt?: boolean;
    }
}