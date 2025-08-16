import { EncryptedRequestBody, ResponseBody } from './index';

// 扩展Koa的类型
declare module 'koa' {
    interface Context {
        body: ResponseBody;
    }
}