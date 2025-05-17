import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { CreateUserDto, OutputUserDto } from '../dtos/user.dto';
import { Either, left, right } from '@shared/either';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class CreateUserUseCase
  implements BaseUseCase<CreateUserDto, Either<Error, OutputUserDto>>
{
  constructor(
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: CreateUserDto): Promise<Either<Error, OutputUserDto>> {
    const cognito = new CognitoIdentityProviderClient({
      region: 'us-east-1',
    });
    try {
      await cognito.send(
        new AdminCreateUserCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          Username: input.email,
          UserAttributes: [{ Name: 'email', Value: input.email }],
          MessageAction: 'SUPPRESS',
        }),
      );
    } catch (err) {
      return left(new Error(`Erro ao iniciar autenticação no Cognito: ${err}`));
    }
    const user = await this.userRepository.create(UserEntity.CreateNew(input));
    if (user.isLeft()) {
      return left(user.value);
    }

    return right({
      email: user.value.getEmail(),
      name: user.value.getName(),
      createdAt: user.value.getCreatedAt(),
      updatedAt: user.value.getUpdatedAt(),
      deletedAt: user.value.getDeletedAt(),
    });
  }
}
