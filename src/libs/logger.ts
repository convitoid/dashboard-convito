import winston from 'winston';
import moment from 'moment-timezone';

const customTimestampFormat = winston.format((info) => {
   const gmtPlus7 = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
   info.timestamp = gmtPlus7;
   return info;
});

const customFormat = winston.format.printf(({ timestamp, level, message, data }) => {
   let logMessage = `${timestamp} [${level}]: ${message}`;
   if (data) {
      logMessage += ` ${JSON.stringify(data)}`;
   }
   return logMessage;
});

const logger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(customTimestampFormat(), customFormat),
   transports: [
      new winston.transports.Console(),
      new winston.transports.File({
         filename: 'logs/combined.log',
         format: winston.format.printf(({ timestamp, level, message, data }) => {
            let logMessage = `${timestamp} [${level}]: ${message}`;
            if (data) {
               logMessage += ` ${JSON.stringify(data)}`;
            }
            return logMessage;
         }),
      }),
   ],
});

export default logger;
