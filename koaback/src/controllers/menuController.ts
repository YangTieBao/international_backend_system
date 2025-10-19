import dayjs from 'dayjs';
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

      let total = await menuDao.totalCount()

      let menuTableData = await menuDao.menuTableData(requestBody) as any

      menuTableData = menuTableData.map((item: object, index: number) => {
        return {
          key: index + 1,
          ...item
        }
      })

      ctx.body = {
        data: { tableData: menuTableData, total }
      }

      await next()
    } catch (err) {
      routerError('menuController/menuTableData', err, ctx)
    }
  }

  // 获取父菜单
  const getParentMenus = async (ctx: Context, next: Next) => {
    try {
      const { grade } = ctx.request.body as any

      const parentData = await menuDao.getParentMenus(grade)

      ctx.body = {
        data: { parentData }
      }

      await next()
    } catch (err) {
      routerError('menuController/getParentMenu', err, ctx)
    }
  }

  // 保存菜单数据
  const save = async (ctx: Context, next: Next) => {
    try {
      const { formData } = ctx.request.body as any
      const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

      await menuDao.save({ ...formData, currentTime, username: ctx.state.user.name, user_id: ctx.state.user.user_id })

      ctx.body = {
        data: { message: '操作成功' }
      }

      await next()
    } catch (err) {
      routerError('menuController/save', err, ctx)
    }
  }

  // 删除菜单数据
  const del = async (ctx: Context, next: Next) => {
    try {
      const { id } = ctx.request.body as any

      await menuDao.del(id)

      ctx.body = {
        data: { message: '操作成功' }
      }

      await next()
    } catch (err) {
      routerError('menuController/del', err, ctx)
    }
  }

  return { getMenus, menuTableData, save, del, getParentMenus }
}