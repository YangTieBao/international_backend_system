export const responses = () => {
    // 成功响应（200）
    const return_200 = (data: Object = {}) => {
        return { status: 200, msg: '请求成功', data }
    }

    // 无内容（204，常用于删除成功）
    const return_204 = () => {
        return { status: 204, msg: '操作成功，无返回内容' }
    }

    // 客户端参数错误（400）
    const return_400 = (error: string = '参数格式错误') => {
        return { status: 400, msg: error }
    }

    // 未认证（401，如Token无效）
    const return_401 = (error: string = '未授权访问，请先登录') => {
        return { status: 401, msg: error }
    }

    // 权限不足（403）
    const return_403 = (error: string = '权限不足，无法访问') => {
        return { status: 403, msg: error }
    }

    // 资源不存在（404）
    const return_404 = (error: string = '请求的资源不存在') => {
        return { status: 404, msg: error }
    }

    // 服务器内部错误（500）
    const return_500 = (error: string = '服务器内部错误，请稍后再试') => {
        return { status: 500, msg: error }
    }

    // 服务暂时不可用（503）
    const return_503 = (error: string = '服务暂时不可用，请稍后再试') => {
        return { status: 503, msg: error }
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