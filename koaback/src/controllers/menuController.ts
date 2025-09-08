import { Context, Next } from 'koa';
import { MenuDao } from '../daos/menuDao';
import { errors } from '../utils';

const { routerError } = errors()

export const menuController = () => {
  const menuDao = MenuDao()

  // 获取左侧菜单
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

  // 获取菜单表格数据
  const menuTableData = async (ctx: Context, next: Next) => {
    try {
      const requestBody = ctx.request.body as any

      let menuTableData = await menuDao.menuTableData(requestBody) as any

      menuTableData = menuTableData.map((item: object, index: number) => {
        return {
          key: index + 1,
          ...item
        }
      })

      ctx.body = {
        data: { menuTableData }
      }

      await next()
    } catch (err) {
      routerError('menuController/menuTableData', err, ctx)
    }
  }

  return { getMenus, menuTableData }
}