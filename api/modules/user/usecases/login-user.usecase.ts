import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { CreateUserDto } from '../dtos/user.dto';
import { Either, right } from '@shared/either';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUserUseCase
  implements BaseUseCase<CreateUserDto, Either<Error, any>>
{
  constructor() {}

  async execute(input: any): Promise<Either<Error, any>> {
    const cognito = new CognitoIdentityProviderClient({
      region: 'us-east-1',
    });

    const auth = await cognito.send(
      new AdminInitiateAuthCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'CUSTOM_AUTH',
        AuthParameters: {
          USERNAME: input.email,
        },
      }),
    );

    return right(auth);
  }
}
