import Router from 'koa-router';
import userRoutes from './userRoutes';

const router = new Router();

// 基础路由
router.get('/', async (ctx) => {
  ctx.body = {
    message: 'Welcome to the API',
    status: 'success'
  };
});

// 挂载用户路由
router.use('/api/users', userRoutes.routes(), userRoutes.allowedMethods());

export default router;
