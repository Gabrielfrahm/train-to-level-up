import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';

import { Either, left, right } from '@shared/either';
import { Inject, Injectable, InjectionToken } from '@nestjs/common';
import { type AuthSendCodeDto } from '../dtos/auth.dto';
import { COGNITO_CLIENT, CognitoClient } from '@shared/clients/cognito.client';

export const AUTH_SEND_CODE_USE_CASE: InjectionToken<AuthSendCodeUseCase> =
  Symbol('AuthSendCodeUseCase');

@Injectable()
export class AuthSendCodeUseCase
  implements BaseUseCase<AuthSendCodeDto, Either<Error, boolean>>
{
  constructor(
    @Inject(COGNITO_CLIENT)
    private readonly cognitoClient: CognitoClient,
  ) {}

  async execute(input: AuthSendCodeDto): Promise<Either<Error, boolean>> {
    const cognito = await this.cognitoClient.sendCode(input.email);
    if (cognito.isLeft()) {
      return left(cognito.value);
    }
    return right(cognito.value);
  }
}
