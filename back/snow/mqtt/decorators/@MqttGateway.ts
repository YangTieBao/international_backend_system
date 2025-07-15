import { IClientOptions } from 'mqtt';
import 'reflect-metadata';
import { META_KEYS } from './constants';

export function MqttGateway(host: string, port: number, opts?: IClientOptions): ClassDecorator {
  if (!host) throw new Error('mqtt的host不能为空');
  if (!port) throw new Error('mqtt的port不能为空');
  return function classDecorator(target: any): any {
    Reflect.defineMetadata(META_KEYS.HOST, host, target);
    Reflect.defineMetadata(META_KEYS.PORT, port, target);
    Reflect.defineMetadata(META_KEYS.OPTS, opts, target);
  };
}
