import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateUserDto, OutputUserDto } from './dtos/user.dto';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { AuthUserUseCase } from './usecases/login-user.usecase';
import { AuthStep2UserUseCase } from './usecases/login-user-step-2.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly loggerService: Logger,

    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authUserUseCase: AuthUserUseCase,
    private readonly authUsersStep2UseCase: AuthStep2UserUseCase,
  ) {}

  @Post('/')
  async createUser(@Body() data: CreateUserDto): Promise<OutputUserDto> {
    const response = await this.createUserUseCase.execute(data);
    if (response.isLeft()) {
      this.loggerService.error(
        `Error when try create new user with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(
      `User created ${JSON.stringify(response.value.email)}`,
    );

    return response.value;
  }

  @Post('/auth')
  async authUser(@Body() data: { email: string }): Promise<OutputUserDto> {
    const response = await this.authUserUseCase.execute(data);
    if (response.isLeft()) {
      this.loggerService.error(
        `Error when try create new user with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(
      `User created ${JSON.stringify(response.value.email)}`,
    );

    return response.value;
  }

  @Post('/auth/step2')
  async authUserStep2(@Body() data: { email: string }): Promise<OutputUserDto> {
    const response = await this.authUsersStep2UseCase.execute(data);
    if (response.isLeft()) {
      this.loggerService.error(
        `Error when try create new user with params ${JSON.stringify(data)}`,
        response.value.stack,
      );
      throw response.value;
    }

    this.loggerService.log(
      `User created ${JSON.stringify(response.value.email)}`,
    );

    return response.value;
  }
}
