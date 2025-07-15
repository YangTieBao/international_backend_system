import mysql from 'mysql2';
import { Pool } from 'mysql2/promise';
import { Configuration } from '../../configuration';

export class DatabasePool {
  private static promisePool: Pool;

  private static initDBPool() {
    const configuration = new Configuration();
    const database = configuration.getConfig('database');

    if (!database) {
      throw new Error('配置文件config.ts不存在database数据库配置项');
    }

    // 创建一个默认配置的连接池
    const options = {
      host: database.host,
      user: database.username,
      password: database.password,
      database: database.database,
      charset: 'utf8',
    };
    const pool = mysql.createPool(options);
    return pool.promise();
  }

  public static getPromisePool() {
    if (!this.promisePool) {
      this.promisePool = this.initDBPool();
    }
    return this.promisePool;
  }
}
