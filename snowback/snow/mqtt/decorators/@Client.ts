import 'reflect-metadata';
import { META_KEYS } from './constants';

export function Client(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(META_KEYS.CLIENT, parameterIndex, target, propertyKey);
  };
}
