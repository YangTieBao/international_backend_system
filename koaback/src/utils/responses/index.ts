import { encrypt_decrypt } from "../crypto"
export const responses = () => {
    const { prepareEncryptedResponse } = encrypt_decrypt()
    // 成功响应（200）
    const return_200 = (data: Object = {}, symmetricKey: string,
        requestData) => {
        const { isEncryptResponse, iv } = requestData
        return isEncryptResponse
            ? {
                code: 200,
                message: '请求成功',
                data: prepareEncryptedResponse(data, symmetricKey, iv)
            } : {
                code: 200,
                message: '请求成功',
                data
            }
    }

    // 无内容（204，常用于删除成功）
    const return_204 = () => {
        return { code: 204, message: '操作成功，无返回内容' }
    }

    // 客户端参数错误（400）
    const return_400 = (error: string = '参数格式错误') => {
        return { code: 400, message: error }
    }

    // 未认证（401，如Token无效）
    const return_401 = (error: string = '未授权访问，请先登录') => {
        return { code: 401, message: error }
    }

    // 权限不足（403）
    const return_403 = (error: string = '权限不足，无法访问') => {
        return { code: 403, message: error }
    }

    // 资源不存在（404）
    const return_404 = (error: string = '请求的资源不存在') => {
        return { code: 404, message: error }
    }

    // 服务器内部错误（500）
    const return_500 = (error: string = '服务器内部错误，请稍后再试') => {
        return { code: 500, message: error }
    }

    // 服务暂时不可用（503）
    const return_503 = (error: string = '服务暂时不可用，请稍后再试') => {
        return { code: 503, message: error }
    }

    return {
        return_200,
        return_204,
        return_400,
        return_401,
        return_403,
        return_404,
        return_500,
        return_503
    }
}