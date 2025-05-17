import {
  CognitoIdentityProviderClient,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { BaseUseCase } from '@shared/interfaces/usecase.interfaces';
import { CreateUserDto } from '../dtos/user.dto';
import { Either, right } from '@shared/either';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthStep2UserUseCase
  implements BaseUseCase<CreateUserDto, Either<Error, any>>
{
  constructor() {}

  async execute(input: any): Promise<Either<Error, any>> {
    const cognito = new CognitoIdentityProviderClient({
      region: 'us-east-1',
    });

    const response = await cognito.send(
      new RespondToAuthChallengeCommand({
        ChallengeName: 'CUSTOM_CHALLENGE',
        ClientId: process.env.COGNITO_CLIENT_ID,
        Session: input.session,
        ChallengeResponses: {
          USERNAME: input.email,
          ANSWER: input.code,
        },
      }),
    );

    return right(response);
  }
}
