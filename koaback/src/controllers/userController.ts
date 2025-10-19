import { Context, Next } from 'koa';
import { UserDao } from '../daos/userDao';
import { errors, getJWTSecret } from '../utils';

const { routerError } = errors()

const jwt = require('jsonwebtoken');
const jwt_secret = getJWTSecret();
const cookie_jwt_validity_period = 2 * 60 * 60 * 1000;

export const userController = () => {
    const userDao = UserDao()

    const login = async (ctx: Context, next: Next) => {
        try {
            const { username, password } = ctx.request.body as any

            const userInfo = await userDao.getUserInfo(username, password)

            if (!userInfo) {
                ctx.body = {
                    code: 401,
                    message: '用户名/手机号码或密码错误'
                }
                ctx.status = 401
            }

            const token = jwt.sign(
                { ...userInfo },
                jwt_secret,
                { expiresIn: cookie_jwt_validity_period }
            );

            ctx.cookies.set('jwtToken', token, {
                maxAge: cookie_jwt_validity_period,
                httpOnly: true,
                domain: '127.0.0.1',
                sameSite: 'lax', // https需为None
                secure: false, // https需为true
                path: '/', // 全站有效
                signed: true,
                overwrite: true // 允许覆盖同名Cookie
            });

            ctx.body = {
                data: { userInfo }
            }

            await next()
        } catch (err) {
            routerError('userController/login', err, ctx)
        }
    }

    return { login }
}