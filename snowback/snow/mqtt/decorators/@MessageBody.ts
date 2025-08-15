import 'reflect-metadata';
import { META_KEYS } from './constants';

export function MessageBody(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(META_KEYS.MASSAGE_DATA, parameterIndex, target, propertyKey);
  };
}
