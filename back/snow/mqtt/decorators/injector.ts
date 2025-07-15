import 'reflect-metadata';
import { META_KEYS } from './constants';

export function getInjections(instance: any, methodName: string, message: string, client: any) {
  const props: any[] = [];
  if (Reflect.hasMetadata(META_KEYS.MASSAGE_DATA, instance, methodName)) {
    const index = Reflect.getMetadata(META_KEYS.MASSAGE_DATA, instance, methodName);
    props[index] = message;
  }

  if (Reflect.hasMetadata(META_KEYS.CLIENT, instance, methodName)) {
    const index = Reflect.getMetadata(META_KEYS.CLIENT, instance, methodName);
    props[index] = client;
  }

  return props;
}
