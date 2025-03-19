import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
// import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
        ),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        // new DailyRotateFile({
        //   filename: 'logs/application-%DATE%.log',
        //   datePattern: 'YYYY-MM-DD',
        //   zippedArchive: true,
        //   maxSize: '20m',
        //   maxFiles: '14d',
        // }),
      ],
    });
  }

  log(message: string): void {
    this.logger.info(message);
  }

  error(message: string, trace: string): void {
    this.logger.error(`${message} Trace: ${trace}`);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  verbose(message: string): void {
    this.logger.verbose(message);
  }
}
