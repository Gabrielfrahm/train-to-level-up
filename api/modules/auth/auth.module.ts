import { Logger, Module } from '@nestjs/common';

import {
  PRISMA_SERVICE,
  PrismaService,
} from '@modules/database/prisma/prisma.service';
import { AuthController } from './auth.controller';
import {
  AUTH_SEND_CODE_USE_CASE,
  AuthSendCodeUseCase,
} from './usecases/auth-send-code.usecase';
import { COGNITO_CLIENT, CognitoClient } from '@shared/clients/cognito.client';
import {
  AUTH_VALIDATE_CODE_USE_CASE,
  AuthValidateCodeUseCase,
} from './usecases/auth-validate-code.usecase';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    Logger,
    {
      provide: COGNITO_CLIENT,
      useClass: CognitoClient,
    },
    {
      provide: PRISMA_SERVICE,
      useClass: PrismaService,
    },
    {
      provide: AUTH_SEND_CODE_USE_CASE,
      useClass: AuthSendCodeUseCase,
    },
    {
      provide: AUTH_VALIDATE_CODE_USE_CASE,
      useClass: AuthValidateCodeUseCase,
    },
  ],
  exports: [AUTH_SEND_CODE_USE_CASE, AUTH_VALIDATE_CODE_USE_CASE],
})
export class AuthModule {}
