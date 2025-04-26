import { Logger, Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthCheckController],
  providers: [Logger],
})
export class AppModule {}
