import { Logger, Module } from '@nestjs/common';
import { UserController } from './user.controller';

import { PrismaService } from '@modules/database/prisma/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { AuthUserUseCase } from './usecases/login-user.usecase';
import { AuthStep2UserUseCase } from './usecases/login-user-step-2.usecase';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    Logger,
    PrismaService,
    {
      provide: 'userRepository',
      useFactory: (prismaService: PrismaService): UserRepository =>
        new UserRepository(prismaService),
      inject: [PrismaService],
    },
    CreateUserUseCase,
    AuthUserUseCase,
    AuthStep2UserUseCase,
  ],
  exports: ['userRepository'],
})
export class UserModule {}
