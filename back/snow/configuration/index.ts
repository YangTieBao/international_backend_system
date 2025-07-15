import path from 'path';
import fs from 'fs';

export interface ConfigOptions {
  port?: number;
  rootPath?: string;
  database?: DatabaseOptions;
}

export interface DatabaseOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class Configuration {
  private config: ConfigOptions;

  /**
   * 获取配置
   * @param expression 取值表达式 示例：obj.a.b
   */
  getConfig(expression?: string) {
    if (!this.config) {
      const configPath = path.join(__dirname, '../../config');
      if (fs.existsSync(`${configPath}.js`) || fs.existsSync(`${configPath}.ts`)) {
        this.config = require(configPath).default || {};
      } else {
        this.config = {};
      }
    }
    return this.parsePath(this.config, expression);
  }

  private parsePath(obj, expression) {
    if (!expression) return obj;
    const segments = expression.split('.');
    for (let key of segments) {
      if (!obj) return;
      obj = obj[key];
    }
    return obj;
  }
}
