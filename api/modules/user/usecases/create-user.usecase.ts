import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
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
  private readonly cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });

  constructor(
    @Inject('userRepository')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: CreateUserDto): Promise<Either<Error, OutputUserDto>> {
    const user = await this.userRepository.create(UserEntity.CreateNew(input));
    if (user.isLeft()) {
      return left(user.value);
    }

    const email = input.email;

    try {
      await this.cognito.send(
        new AdminInitiateAuthCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          ClientId: process.env.COGNITO_CLIENT_ID,
          AuthFlow: 'CUSTOM_AUTH',
          AuthParameters: {
            USERNAME: email,
          },
        }),
      );
    } catch (err) {
      return left(new Error(`Erro ao iniciar autenticação no Cognito: ${err}`));
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
