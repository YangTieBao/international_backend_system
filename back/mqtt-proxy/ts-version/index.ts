import mosca, { Client, Packet } from 'mosca';
import { config } from './config';

const { port, hardwareClientId } = config;

const connector = new Set<string>();
const failMsgTopicMap = new Map<string, Packet[]>();

const server = new mosca.Server({ port });

server.on('ready', setup);

server.on('clientConnected', function (client: Client) {
  if (!client) return;
  console.log('连接：', client.id);

  connector.add(client.id);
});

server.on('clientDisconnected', function (client: Client) {
  if (!client) return;
  console.log('断开连接：', client.id);

  connector.delete(client.id);
});

server.on('published', (packet: Packet, client: Client) => {
  if (!packet || !client) return;
  console.log('published', packet);

  const { topic } = packet;
  const { id: clientId } = client;

  if (isSendFail(clientId)) {
    const failMsg = failMsgTopicMap.get(topic) || [];
    failMsg.push(packet);
    failMsgTopicMap.set(topic, failMsg);
  }
});

server.on('subscribed', (topic: string, client: Client) => {
  if (!topic || !client) return;

  if (failMsgTopicMap.has(topic)) {
    const failMsg = failMsgTopicMap.get(topic) || [];
    failMsg.forEach((packet) => {
      server.publish(packet, null);
    });
    failMsgTopicMap.delete(topic);
  }
});

function setup() {
  console.log(`### Mosca server is up and running -- port: ${port}`);
}

function isSendFail(clientId) {
  const isHardWareClient = hardwareClientId === clientId;
  return (
    (isHardWareClient && connector.size === 1 && connector.has(hardwareClientId)) ||
    (!isHardWareClient && !connector.has(hardwareClientId))
  );
}
