import { Context, Next } from 'koa';
import { EncryptedRequestBody } from '../types';
import { encrypt_decrypt } from '../utils';

const { handleEncryptedRequest } = encrypt_decrypt()

export async function decryptRequest(ctx: Context, next: Next) {
    if (ctx.path === '/base-api/commons/getPublicKey' && ctx.method.toLocaleUpperCase() === 'GET') {
        // 直接进入下一个中间件，不执行解密
        await next();
        return;
    }

    const body = ctx.request.body as EncryptedRequestBody

    const decryptedData = handleEncryptedRequest(body)
    
    // 替换请求的数据为解密后的数据
    ctx.request.body = { isEncryptResponse: body.isEncryptResponse, ...decryptedData }

    // 处理后续中间件
    await next();
}
