import dotenv from 'dotenv';
// 加载环境变量
dotenv.config();

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import { connectDB } from './config/database';
import { cookieCheck } from './middleware/cookieCheck';
import { decryptRequest } from './middleware/dectyptRequest';
import { encryptResponse } from './middleware/encryptoResponse';
import router from './routes';
import { generateCookieSecret } from './utils';

// 创建Koa应用
const app = new Koa();
const PORT = Number(process.env.PORT);
const HOST = process.env.HOST || '127.0.0.1';

app.keys = [
  generateCookieSecret()
]

// 连接数据库
connectDB();

app.use(cors({
  // 允许的源：开发环境可以用*
  origin: 'http://127.0.0.1:5173',

  // 允许的请求方法
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  // 允许的请求头
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

  // 允许前端获取的响应头
  exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],

  // 是否允许发送Cookie
  credentials: true,

  // 预检请求的缓存时间（秒），减少OPTIONS请求次数
  maxAge: 86400
}));

// 中间件
app.use(bodyParser());

// 验证cookie与jwt
app.use(cookieCheck);

// 解密请求体
app.use(decryptRequest);

// 路由
app.use(router.routes());
app.use(router.allowedMethods());

// 加密响应数据
app.use(encryptResponse);

// 启动服务器
app.listen(PORT, HOST, () => {
  const serverUrl = `http://${HOST}:${PORT}`;
  console.log(`Koa服务器已启动：${serverUrl}！`);
});

export default app;
