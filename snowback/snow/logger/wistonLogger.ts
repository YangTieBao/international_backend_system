import { createLogger, format, Logger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const wistonLogger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`),
    format.colorize({
      all: true,
      colors: {
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red',
      },
    }),
  ),
  transports: [
    // new transports.File({ filename: './log/runtime_error.log', level: 'error' }),
    // new DailyRotateFile({
    //   filename: './log/runtime_%DATE%.log',
    //   datePattern: 'YYYYMMDD',
    //   zippedArchive: false,
    //   maxSize: '5g',
    //   maxFiles: '14d',
    // }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  wistonLogger.add(new transports.Console());
}

export default wistonLogger;
