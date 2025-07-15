import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { useController } from '../../controller';
import Logger from '../../logger';
import fs from 'fs';
import { isFunction } from '../../utils';
import { Configuration } from '../../configuration';

/**
 * 启动注解
 * @param controllerScan controller扫码路径，default: src/controller
 */
export function Application(controllerScanPath = './src/controller'): ClassDecorator {
  return (target: Function) => {
    const configuration = new Configuration();
    const { rootPath = '/', port = '3000' } = configuration.getConfig();

    const app = express();
    app.use(cors());
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
      Logger.info(`### snow has been to starting -- http://localhost:${port}${rootPath}`);

      if (isFunction(after)) {
        after(app);
      }
    });
  };
}
