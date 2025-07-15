import 'reflect-metadata';
import { META_KEYS } from './constants';
import { TopicsMap } from './types';

export function SubscribeMessage(topicName: string): MethodDecorator {
  if (!topicName) throw new Error('订阅的topicName不能为空');
  return (target, methodName: any, descriptor: TypedPropertyDescriptor<any>) => {
    const topicsMap: TopicsMap = Reflect.getOwnMetadata(META_KEYS.TOPICS, target) || {};
    topicsMap[topicName] = methodName;
    Reflect.defineMetadata(META_KEYS.TOPICS, topicsMap, target);
  };
}
