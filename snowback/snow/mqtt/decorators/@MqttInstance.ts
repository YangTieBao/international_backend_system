import 'reflect-metadata';
import { META_KEYS } from './constants';

export function MqttInstance() {
  return function (target: any, propertyName: string) {
    Reflect.defineMetadata(META_KEYS.MQTT_INSTANCE, propertyName, target);
  };
}
