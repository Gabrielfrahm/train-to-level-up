import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { LoggingModule } from '@modules/logger/logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LoggingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
