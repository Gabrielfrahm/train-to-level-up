import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { CreateUserDto, OutputUserDto } from '../dtos/user.dto';
import { Either, left, right } from '@shared/either';
import { Inject, Injectable, InjectionToken } from '@nestjs/common';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { USER_REPOSITORY_USER_REPOSITORY } from '../repositories/user.repository';
import { COGNITO_CLIENT, CognitoClient } from '@shared/clients/cognito.client';

export const CREATE_USER_USE_CASE: InjectionToken = Symbol('CreateUserUseCase');

@Injectable()
export class CreateUserUseCase
  implements BaseUseCase<CreateUserDto, Either<Error, OutputUserDto>>
{
  constructor(
    @Inject(USER_REPOSITORY_USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(COGNITO_CLIENT)
    private readonly cognitoClient: CognitoClient,
  ) {}

  async execute(input: CreateUserDto): Promise<Either<Error, OutputUserDto>> {
    const cognitoCommand = await this.cognitoClient.createUser(input);
    if (cognitoCommand.isLeft()) {
      return left(cognitoCommand.value);
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
