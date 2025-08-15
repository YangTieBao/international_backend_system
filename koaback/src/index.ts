import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './config/database';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 创建Koa应用
const app = new Koa();
const PORT = process.env.PORT || 3000;

// 连接数据库
connectDB();

// 中间件
app.use(errorHandler);
app.use(bodyParser());

// 路由
app.use(router.routes());
app.use(router.allowedMethods());

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
