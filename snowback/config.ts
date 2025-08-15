import { ConfigOptions } from './snow/configuration';

const config: ConfigOptions = {
  port: 8000,
  rootPath: '/base-api',
  database: {
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'ytb@2003',
    database: 'international_backend_system',
  },
};

export default config;
