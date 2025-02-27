import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './logger.service';

@Module({
  providers: [
    {
      provide: 'WinstonLoggerService',
      useFactory: (): WinstonLoggerService => new WinstonLoggerService(),
    },
  ],
  exports: ['WinstonLoggerService'],
})
export class LoggingModule {}
