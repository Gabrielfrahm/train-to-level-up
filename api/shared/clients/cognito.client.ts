import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, InjectionToken } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import {
  ISendCodeInput,
  IValidateCodeOutput,
} from './dtos/identity.client.dto';

export const COGNITO_CLIENT: InjectionToken<CognitoClient> = Symbol(
  'IIdentityProviderClient',
);

export interface IIdentityProviderClient {
  createUser(input: {
    name: string;
    email: string;
  }): Promise<Either<Error, boolean>>;
  sendCode(email: string): Promise<Either<Error, ISendCodeInput>>;
  validateCode(input: {
    email: string;
    code: string;
    session: string;
  }): Promise<Either<Error, IValidateCodeOutput>>;
}

@Injectable()
export class CognitoClient implements IIdentityProviderClient {
  private readonly cognito: CognitoIdentityProviderClient;

  constructor() {
    this.cognito = new CognitoIdentityProviderClient({
      region: 'us-east-1',
    });
  }

  async createUser(input: {
    name: string;
    email: string;
  }): Promise<Either<Error, boolean>> {
    try {
      const command = new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: input.email,
        UserAttributes: [
          { Name: 'email', Value: input.email },
          { Name: 'name', Value: input.name },
        ],
        MessageAction: 'SUPPRESS',
      });

      await this.cognito.send(command);
      return right(true);
    } catch (error) {
      console.error('Error creating user:', error);
      return left(error);
    }
  }

  async sendCode(email: string): Promise<Either<Error, ISendCodeInput>> {
    try {
      const command = new AdminInitiateAuthCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'CUSTOM_AUTH',
        AuthParameters: {
          USERNAME: email,
        },
      });
      const sendCode = await this.cognito.send(command);
      return right({
        email: email,
        session: sendCode.Session,
      });
    } catch (error) {
      console.error('Error sending code:', error);
      return left(error);
    }
  }

  async validateCode(input: {
    email: string;
    code: string;
    session: string;
  }): Promise<Either<Error, IValidateCodeOutput>> {
    try {
      const command = new RespondToAuthChallengeCommand({
        ChallengeName: 'CUSTOM_CHALLENGE',
        ClientId: process.env.COGNITO_CLIENT_ID,
        Session: input.session,
        ChallengeResponses: {
          USERNAME: input.email,
          ANSWER: input.code,
        },
      });
      const validate = await this.cognito.send(command);
      return right({
        accessToken: validate.AuthenticationResult.AccessToken,
        refreshToken: validate.AuthenticationResult.RefreshToken,
        idToken: validate.AuthenticationResult.IdToken,
        expiresIn: validate.AuthenticationResult.ExpiresIn.toString(),
        typeToken: validate.AuthenticationResult.TokenType,
      });
    } catch (error) {
      console.error('Error validate code:', error);
      return left(error);
    }
  }
}
