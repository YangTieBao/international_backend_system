import 'reflect-metadata';
import { BaseDaoOptions } from '../types';
import { META_KEYS } from './constants/index';

export function Dao(options: string | BaseDaoOptions): any {
  return (target) => {
    const tableName = typeof options === 'string' ? options : options.tableName;
    const primaryKey = typeof options === 'string' ? 'id' : options.primaryKey;

    Reflect.defineMetadata(META_KEYS.TABLE_NAME, tableName, target);
    Reflect.defineMetadata(META_KEYS.PRIMARY_KEY, tableName, target);

    return class extends target {
      constructor() {
        super({
          tableName,
          primaryKey,
        });
      }
    };
  };
}
