import 'reflect-metadata';
import mqtt, { MqttClient } from 'mqtt';
import { META_KEYS } from '../decorators/constants';
import { TopicsMap } from '../decorators/types';
import { getInjections } from '../decorators/injector';
import Logger from '../../logger';

export function useMqtt(mqttServer: any) {
  const host = Reflect.getMetadata(META_KEYS.HOST, mqttServer.constructor);
  const port = Reflect.getMetadata(META_KEYS.PORT, mqttServer.constructor);
  const opts = Reflect.getMetadata(META_KEYS.OPTS, mqttServer.constructor);
  const mqttInstance = Reflect.getMetadata(META_KEYS.MQTT_INSTANCE, mqttServer);
  const topicsMap: TopicsMap = Reflect.getMetadata(META_KEYS.TOPICS, mqttServer);
  const client: MqttClient = mqtt.connect(`mqtt://${host}:${port}`, opts);

  if (mqttInstance) {
    mqttServer[mqttInstance] = client;
  }

  client.on('connect', function () {
    Logger.info(`### mqtt connect success -- mqtt://${host}:${port}`);

    if (topicsMap) {
      Object.keys(topicsMap).forEach((topicName) => {
        client.subscribe(topicName);
      });
    }
  });

  client.on('message', function (topic, message) {
    if (topicsMap[topic]) {
      const methodName = topicsMap[topic];
      const injections = getInjections(mqttServer, methodName, message?.toString(), client);
      mqttServer[methodName](...injections);
    }
  });
}
