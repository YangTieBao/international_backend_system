import { DatabaseError } from '../../excption';
import Logger from '../../logger';
import { BaseDaoOptions, limitOptions, OrderOptions } from '../types';
import { DatabasePool } from './DatabasePool';
import { sqlWhere, sqlUpdateSet, updateSqlValues, rowsDataIntercept, styleHyphenFormat } from './dbTools';

export class BaseDao {
  /**
   * 从数据库连接池中拿到一个连接
   */
  static getPool() {
    return DatabasePool.getPromisePool();
  }

  /**
   * 执行预处理sql，sql语句中的变量值必需使用 `?`，且顺序和个数必需和`params`数组中的值一一对应。
   * @param {string} sql 预处理sql语句
   * @param {array} params sql中的参数值
   *
   * 示例：query('select * from table where something = ?',['xxx']);
   */
  static async query(sql: string, params?: Array<string | number>) {
    if (!sql) throw new Error('执行sql方法，sql语句不存在');
    Logger.sql(sql, params);
    // console.log(sql, params);
    
    const result = await BaseDao.getPool()
      .query(sql, params)
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
    const rows: any = result[0];
    rowsDataIntercept(rows);
    return rows;
  }

  tableName: string;
  primaryKey: string;

  /**
   * Dao层构造函数
   * @param {string} tableName 数据库表格名称
   * @param {string} primaryKey 数据库主键名
   */
  constructor(options?: BaseDaoOptions) {
    const { tableName, primaryKey = 'id' } = options;
    if (!tableName) throw new Error('初始化Dao未指定数据库表名');

    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.select = this.select.bind(this);
    this.selectById = this.selectById.bind(this);
    this.selectCount = this.selectCount.bind(this);
    this.selectPage = this.selectPage.bind(this);
    this.insert = this.insert.bind(this);
    this.insertBatch = this.insertBatch.bind(this);
    this.update = this.update.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  /**
   * 根据条件分页查询数据
   * 根据`params`对象的key值拼凑出sql语句的where条件，并使用and连接
   * @param {object} params 查询条件参数
   * @param {{int,int}} limit 分页参数，包含*offset*和*size*；如果为空则查询所有
   * @param {{string,string}} order 排序参数，包含*dirc*和*field*；dirc为排序方向，field为排序的字段
   *
   * todo:1. TS
   *
   *
   * 示例：select({UserType, Name},{offset:0,limit:10})
   * sql: `select * from tableName where user_type=? and name=? limit 0, 10`
   */
  async select(params?: { [index: string]: any }, limit?: limitOptions, order?: OrderOptions) {
    const [where, values] = sqlWhere(params);
    let sql = `select * from ${this.tableName}`;
    if (where) sql += where;

    const { dirc, field } = order || {};
    if (dirc && field) {
      sql += ` order by ?? ${dirc}`;
      values.push(field);
    }

    const { page, size } = limit || {};
    if (page && size) {
      if (!Number.isInteger(page)) throw new Error('limit参数offset属性必需为整数');
      if (!Number.isInteger(size)) throw new Error('limit参数size属性必需为整数');
      sql += ` limit ?, ?`;
      values.push((page - 1) * size);
      values.push(size);
    }
    //  console.log(sql);
     
    Logger.sql(sql, values);
    const result = await BaseDao.getPool()
      .query(sql, values)
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
    const rows: any = result[0];
    rowsDataIntercept(rows);
    return rows;
  }

  /**
   * 根据条件查询一条数据
   * 根据`params`对象的key值拼凑出sql语句的where条件，并使用and连接
   * @param {object} params 查询条件参数
   *
   * todo:1. TS
   *
   *
   * 示例：select({UserType, Name}
   * sql: `select * from tableName where user_type=? and name=? limt 0, 1`
   */
  async selectOne(params?: { [index: string]: any }) {
    const result = await this.select(params, { page: 1, size: 1 });
    rowsDataIntercept(result);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 根据主键查询数据
   * @param {string|number} id 主键值
   *
   * 示例：selectById(5)
   * sql:`select * from tableName where primaryKey = ?`
   */
  async selectById(id: string | number): Promise<any> {
    if (!id && id !== 0) throw new Error('selectById缺少id参数');
    const sql = `select * from ${this.tableName} where \`${this.primaryKey}\` = ?`;
    Logger.sql(sql, [id]);
    const result = await BaseDao.getPool()
      .query(sql, [id])
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
    const rows: any = result[0];
    rowsDataIntercept(rows);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * 根据多个主键查询多条数据
   * @param {Array[string/number]} ids 主键值列表
   *
   * 示例：selectByIds([1,2,3])
   * sql:`select * from tableName where primaryKey in ?`
   */
  async selectByIds(ids: string[] | number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('selectByIds缺少id参数');
    }
    const sql = `select * from ${this.tableName} where \`${this.primaryKey}\` in (?)`;
    Logger.sql(sql, ids);
    const result = await BaseDao.getPool()
      .query(sql, [ids])
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
    const rows: any = result[0];
    rowsDataIntercept(rows);
    return rows;
  }

  /**
   * 根据条件查询记录数
   * @param {object} params 查询条件参数
   *
   * 示例：select({type, name},{offset:0,limit:10})
   * sql: `select count(*) from tableName where type=? and name=?`
   */
  async selectCount(params?: { [index: string]: any }) {
    const [where, values] = sqlWhere(params);
    let sql = `select count(*) from ${this.tableName}`;
    if (where) sql += where;
    Logger.sql(sql, values);
    const result = await BaseDao.getPool()
      .query(sql, values)
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
    return result[0][0]['count(*)'];
  }

  /**
   * 根据条件查询分页数据和总记录数
   * @param {object} params 查询条件参数
   * @param {{int,int}} limit 分页参数，默认*offset*为0和*size*为10
   *
   * 示例：select({type, name},{offset:0,size:10})
   * sql: `select * from tableName where type=? and name=? limit 0, 10`
   * sql: `select count(*) from tableName where type=? and name=?`
   */
  async selectPage(params?: { [index: string]: any }, limit?: limitOptions, order?: OrderOptions) {
    const { page = 1, size = 10 } = limit || {};
    const records = await this.select(params, { page, size }, order);
    const total = await this.selectCount(params);
    return { records, total };
  }

  /**
   * 插入一条记录，会根据'bean'对象的所有属性名作为sql的字段生成sql语句。
   * 注意：参数对象的属性名必须能对应上表格的字段，否则sql会报错
   * @param {object} bean 插入数据库的数据
   *
   * 示例：insert({name,age})
   * sql：`insert into tableName (name, age) values (?, ?)`
   */
  async insert(bean: { [index: string]: any }) {
    if (!bean) throw Error('insert缺少bean参数');
    const keys = Object.keys(bean);
    const fieldsSql = keys.map((key) => `\`${styleHyphenFormat(key)}\``);
    const sql = `insert into ${this.tableName} (${fieldsSql}) values (${keys.map(() => '?')})`;
    console.log(sql);
    
    const values = Object.values(bean);
    Logger.sql(sql, values);
    const result: any = await BaseDao.getPool()
      .query(sql, values)
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
    return result[0].insertId;
  }

  /**
   * 批量插入数据，会根据数组第一个对象去解析属性名生成sql语句。所以，对象数组里面的所有对象属性顺序要保持一致。
   * @param {Array<object>} beans 插入数据数组
   *
   * 示例：insertBatch({name,age})
   * sql：`insert into tableName (name, age) values (?, ?)`
   */
  async insertBatch(beans: Array<{ [index: string]: any }>) {
    if (!Array.isArray(beans)) {
      throw Error('批量插入的参数必须是数组,如果插入对象，请使用insert方法');
    }
    if (beans.length === 0) {
      Logger.info('批量插入方法参数为空数组,不执行sql');
      return;
    }
    const keys = Object.keys(beans[0]);
    const fieldsSql = keys.map((key) => `\`${styleHyphenFormat(key)}\``);

    const sql = `insert into ${this.tableName} (${fieldsSql}) values ?`;
    const values: Array<object> = [];
    beans.forEach((v) => {
      values.push(Object.values(v));
    });
    Logger.sql(sql, [values]);
    return BaseDao.getPool()
      .query(sql, [values])
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
  }

  /**
   * 根据主键更新记录，会根据'bean'对象的所有属性名作为sql的字段生成sql语句。
   * @param {string/int} id 主键值
   * @param {object} bean 修改的数据
   *
   * 示例：update(5, {name,age})
   * sql：`update tableName set name = ?, age = ? where primaryKey = ?`
   */
  async update(id: string | number, bean: { [index: string]: any }) {
    if (!id && id !== 0) throw Error('update缺少id参数');
    if (!bean) throw Error('update缺少bean参数');
    let sql = `update ${this.tableName}`;
    sql += sqlUpdateSet(bean);
    sql += ` where \`${this.primaryKey}\` = ?`;
    // console.log(sql);
    
    const values = updateSqlValues(bean, id);
    if (values.length === 0) throw Error('update缺少必要参数');
    Logger.sql(sql, values);
    return BaseDao.getPool()
      .query(sql, values)
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
  }

  /**
   * 根据主键删除记录
   * @param {string/int} id 主键值
   *
   * 示例：deleteById(5)
   * sql：`delete from tableName where primaryKey = ?`
   */
  async deleteById(id: string | number) {
    if (!id && id !== 0) throw Error('deleteById缺少id参数');
    const sql = `delete from ${this.tableName} where ${this.primaryKey}=?`;
    Logger.sql(sql, [id]);
    return BaseDao.getPool()
      .query(sql, [id])
      .catch((e) => {
        Logger.error(`数据库错误:${e.message}`);
        throw new DatabaseError(e.message);
      });
  }
}
