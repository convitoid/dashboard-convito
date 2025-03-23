import winston from 'winston';
import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';

const LOG_DIR = 'logs';
const LOG_FILE = path.join(LOG_DIR, 'combined.log');
const LOG_EXPIRATION_DAYS = 60; // 2 bulan

// Fungsi untuk menghapus file log jika sudah lebih dari 2 bulan
const cleanupOldLogs = () => {
   if (fs.existsSync(LOG_FILE)) {
      const stats = fs.statSync(LOG_FILE);
      const lastModified = moment(stats.mtime);
      const now = moment();

      console.log('lastModified', lastModified);

      if (now.diff(lastModified, 'days') > LOG_EXPIRATION_DAYS) {
         fs.unlinkSync(LOG_FILE);
         console.log(`Log file ${LOG_FILE} dihapus karena sudah lebih dari ${LOG_EXPIRATION_DAYS} hari.`);
      }
   }
};

// Jalankan pembersihan sebelum logger digunakan
cleanupOldLogs();

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
         filename: LOG_FILE,
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
