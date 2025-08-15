import { BaseDao } from '../dao/BaseDao';

export function Sql(sql: string): MethodDecorator {
  return (target: Function, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    descriptor.value = async (...args) => {
      return await BaseDao.query(sql, args);
    };
  };
}
