import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import {
  AuthSendCodeDto,
  AuthSendCodeOutputDto,
  AuthValidateCodeDto,
  AuthValidateCodeOutputDto,
} from './dtos/auth.dto';
import {
  AUTH_SEND_CODE_USE_CASE,
  AuthSendCodeUseCase,
} from './usecases/auth-send-code.usecase';
import {
  AUTH_VALIDATE_CODE_USE_CASE,
  AuthValidateCodeUseCase,
} from './usecases/auth-validate-code.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loggerService: Logger,
    @Inject(AUTH_SEND_CODE_USE_CASE)
    private readonly authSendCodeUseCase: AuthSendCodeUseCase,

    @Inject(AUTH_VALIDATE_CODE_USE_CASE)
    private readonly authValidateCodeUseCase: AuthValidateCodeUseCase,
  ) {}

  @Post('/send-code')
  async authUser(
    @Body() data: AuthSendCodeDto,
  ): Promise<AuthSendCodeOutputDto> {
    const response = await this.authSendCodeUseCase.execute(data);
    if (response.isLeft()) {
      this.loggerService.error(
        `Error when try send code with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(`send code to email: ${JSON.stringify(data.email)}`);

    return response.value;
  }

  @Post('/validate-code')
  async authUserStep2(
    @Body() data: AuthValidateCodeDto,
  ): Promise<AuthValidateCodeOutputDto> {
    const response = await this.authValidateCodeUseCase.execute(data);
    if (response.isLeft()) {
      this.loggerService.error(
        `Error when try validate code ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(
      `success validate code ${JSON.stringify(data.email)}`,
    );

    return response.value;
  }
}
