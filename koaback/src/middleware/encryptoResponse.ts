import { Context, Next } from 'koa';
import { EncryptedRequestBody, ResponseBody } from '../types';
import { encrypt_decrypt } from '../utils';

const { prepareEncryptedResponse } = encrypt_decrypt()

export async function encryptResponse(ctx: Context, next: Next) {
  // 先执行后续中间件（路由处理等）
  await next();

  // 只对成功的响应进行加密
  if (ctx.status === 200) {
    try {
      const body = ctx.body as ResponseBody
      const requestBody = ctx.request.body as EncryptedRequestBody
      const { isEncryptResponse } = requestBody

      if (!isEncryptResponse) {
        ctx.body = {
          code: body?.code || 200,
          message: body?.message || '操作成功',
          data: body?.data
        }
        return;
      }
      const encryptedData = prepareEncryptedResponse(body)

      // 替换响应体为加密后的数据
      ctx.body = {
        code: body?.code || 200,
        message: body?.message || '操作成功',
        data: encryptedData
      };

    } catch (error) {
      ctx.body = {
        code: 500,
        message: '数据加密失败'
      };
      ctx.status = 500;
    }
  }
}
