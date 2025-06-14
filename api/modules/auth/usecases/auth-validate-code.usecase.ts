import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';

import { Either, left, right } from '@shared/either';
import { Inject, Injectable, InjectionToken } from '@nestjs/common';
import {
  AuthValidateCodeDto,
  AuthValidateCodeOutputDto,
} from '../dtos/auth.dto';
import { COGNITO_CLIENT, CognitoClient } from '@shared/clients/cognito.client';

export const AUTH_VALIDATE_CODE_USE_CASE: InjectionToken<AuthValidateCodeUseCase> =
  Symbol('AuthValidateCodeUseCase');

@Injectable()
export class AuthValidateCodeUseCase
  implements
    BaseUseCase<AuthValidateCodeDto, Either<Error, AuthValidateCodeOutputDto>>
{
  constructor(
    @Inject(COGNITO_CLIENT)
    private readonly cognitoClient: CognitoClient,
  ) {}

  async execute(
    input: AuthValidateCodeDto,
  ): Promise<Either<Error, AuthValidateCodeOutputDto>> {
    const response = await this.cognitoClient.validateCode(input);

    if (response.isLeft()) {
      return left(response.value);
    }

    return right(response.value);
  }
}
