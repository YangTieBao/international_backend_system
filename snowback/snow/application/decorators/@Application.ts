import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { Configuration } from '../../configuration';
import { useController } from '../../controller';
import Logger from '../../logger';
import { isFunction } from '../../utils';

/**
 * 启动注解
 * @param controllerScan controller扫码路径，default: src/controller
 */
export function Application(controllerScanPath = './src/controller'): ClassDecorator {
  return (target: Function) => {
    const configuration = new Configuration();
    const { rootPath = '/', port = '3000' } = configuration.getConfig();

    const app = express();
    app.use(cors({
      // 明确指定前端域名（不能用 *）
      origin: 'http://127.0.0.1:5173',
      // 允许携带凭证
      credentials: true,
      // 允许前端使用的请求方法
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
      // 允许前端请求头中携带的字段
      allowedHeaders: ['Content-Type', 'Authorization'],
      // 允许前端读取的响应头（按需添加）
      exposedHeaders: ['Set-Cookie']
    }));
    // app.use(cors());
    app.use('/static', express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(rootPath, useController(controllerScanPath));

    target.prototype.app = app;

    const before = target.prototype.before;
    const after = target.prototype.after;
    if (isFunction(before)) {
      before(app);
    }

    app.listen(port, () => {
      if (fs.existsSync(path.join(process.cwd(), './banner.txt'))) {
        console.log(fs.readFileSync(path.join(process.cwd(), './banner.txt'), 'utf8'));
      } else if (fs.existsSync(path.join(__dirname, './banner.txt'))) {
        console.log(fs.readFileSync(path.join(__dirname, './banner.txt'), 'utf8'));
      }
      Logger.info(`### snow has been to starting -- http://127.0.0.1:${port}${rootPath}`);

      if (isFunction(after)) {
        after(app);
      }
    });
  };
}
