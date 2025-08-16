import Router from 'koa-router';
import commonsRouters from './commonsRoutes';
import userRoutes from './userRoutes';
import menuRoutes from './menuRoutes'

const router = new Router();

// 挂载普通路由
router.use('/base-api/commons', commonsRouters.routes(), commonsRouters.allowedMethods());

// 挂载用户路由
router.use('/base-api/users', userRoutes.routes(), userRoutes.allowedMethods());

// 挂载菜单路由
router.use('/base-api/menus', menuRoutes.routes(), menuRoutes.allowedMethods());

export default router;
