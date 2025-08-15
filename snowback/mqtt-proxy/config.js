const config = {
  port: 1883,
  // 只有cld1 cld2这两个客户端可以连接到MQTT服务器
  hardwareClientId: ['cld1', 'cld2'],
  timeOver: 4 * 1000,
};

module.exports = config;
