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
        Session:
          'AYABeMqclp-HOpmFVFXunbbHqw4AHQABAAdTZXJ2aWNlABBDb2duaXRvVXNlclBvb2xzAAEAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTo3NDU2MjM0Njc1NTU6a2V5L2IxNTVhZmNhLWJmMjktNGVlZC1hZmQ4LWE5ZTA5MzY1M2RiZQC4AQIBAHhR9E4zNbI1ofi3Y01_Ljgh2wK-ZaC__bKufjbgmejy4gHAqtud9E1949oo6LgXNXjsAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMeopG5QFUsPB8wKT7AgEQgDvYBdnU9_dM6xerwJbsXLXjZk2pN169EdOvhBCiUilbYuCnyDUdd55PGGx8wbWPAR3nN1Kx4dc4D5_EoAIAAAAADAAAEAAAAAAAAAAAAAAAAAArGfI40K5TZsSqCPcpBJf7_____wAAAAEAAAAAAAAAAAAAAAEAAAEoG0zVNVnudfgxnXYrjtZbQFWXx5Dtm5Y2ZWFFtH7He2yMI2xCxJyyn_N6K6EId9TAeaI6KxCvfmYnOyo9B8PWL2ADYMwO1b7J7UwEn64fC__mlkimy9wIQcC6Zl-Ml31JCJo3BT2GvvErPdaQ02l6UmcSmbm-sFdZw2COKXBPNsC5JdH42_bdG-UIVyiEXNkaOpf6zNzuEfGKYgBEv8-7mysk6LWZLtZ02CbWZeumlLki2kftGvdcRnVPDop8FTS9-g4E-6pNPPUlCSmJaD7c5dTULwj78SDLtcfC5vAruZMSq3rDEByeUTKP0MXs7aB7xGe4z08GsI8_OdrFdtyFyyygH5PaOENuN9qqRVp35uTfUvhWg3FZdfoZ_N485WpwZeMpa10zUFZLxo-mvw-BDEscuO7zeuoJ',
        ChallengeResponses: {
          USERNAME: input.email,
          ANSWER: input.code,
        },
      }),
    );

    return right(response);
  }
}
