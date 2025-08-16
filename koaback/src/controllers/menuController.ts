import { Context, Next } from 'koa';
import { MenuDao } from '../daos/menuDao';
import { errors } from '../utils';

const { routerError } = errors()

export const menuController = () => {
  const menuDao = MenuDao()

  const getMenus = async (ctx: Context, next: Next) => {
    try {
      const { user_id } = ctx.request.body as any

      const menus = await menuDao.getMenus(user_id)

      ctx.body = {
        data: { menus }
      }

      await next()
    } catch (err) {
      routerError('menuController/getMenus', err, ctx)
    }
  }

  return { getMenus }
}