import { Context, Next } from 'koa';
import { generateJWTSecret } from '../utils';

const jwt = require('jsonwebtoken');
const jwt_secret = generateJWTSecret();

// 白名单
const WHITE_LIST = [
    '/base-api/commons/getPublicKey',
    '/base-api/users/login',
    '/base-api/users/register',
    '/base-api/commons/languages',
];

export async function cookieCheck(ctx: Context, next: Next) {
    // 白名单路由直接放行
    if (WHITE_LIST.some(path => ctx.path.startsWith(path))) {
        await next();
        return;
    }

    try {
        const token = ctx.cookies.get('jwtToken', { signed: true });

        // 检查Token是否存在
        if (!token) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: '会话已失效'
            };
            return;
        }

        // 验证JWT有效性
        const decoded = jwt.verify(token, jwt_secret);

        // 将验证后的用户信息存入上下文，供后续中间件/路由使用
        ctx.state.user = decoded;

        // 继续执行后续中间件
        await next();
    } catch (error) {
        // 处理验证失败的情况（如Token过期、无效）
        ctx.status = 401;
        ctx.body = {
            code: 401,
            message: '会话已失效'
        };
    }
}
