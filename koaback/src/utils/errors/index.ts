import { Context } from 'koa'

export const errors = () => {
    const routerError = (routerUrl: string, err: any, ctx: Context) => {
        console.error(routerUrl + '出现错误：' + err)
        ctx.body = {
            code: 500,
            message: '服务器出现错误'
        }
        ctx.status = 500
    }
    return { routerError }
}