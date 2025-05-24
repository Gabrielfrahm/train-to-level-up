import { Logger, Module } from '@nestjs/common';
import { UserController } from './user.controller';

import {
  PRISMA_SERVICE,
  PrismaService,
} from '@modules/database/prisma/prisma.service';
import {
  USER_REPOSITORY_USER_REPOSITORY,
  UserRepository,
} from './repositories/user.repository';
import {
  CREATE_USER_USE_CASE,
  CreateUserUseCase,
} from './usecases/create-user.usecase';

import { COGNITO_CLIENT, CognitoClient } from '@shared/clients/cognito.client';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    Logger,
    {
      provide: PRISMA_SERVICE,
      useClass: PrismaService,
    },
    {
      provide: COGNITO_CLIENT,
      useClass: CognitoClient,
    },
    {
      provide: USER_REPOSITORY_USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: CREATE_USER_USE_CASE,
      useClass: CreateUserUseCase,
    },
  ],
  exports: [USER_REPOSITORY_USER_REPOSITORY, CREATE_USER_USE_CASE],
})
export class UserModule {}
