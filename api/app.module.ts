import { Logger, Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthCheckController],
  providers: [Logger],
})
export class AppModule {}
