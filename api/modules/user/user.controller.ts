import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { CreateUserDto, OutputUserDto } from './dtos/user.dto';
import {
  CREATE_USER_USE_CASE,
  CreateUserUseCase,
} from './usecases/create-user.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly loggerService: Logger,
    @Inject(CREATE_USER_USE_CASE)
    private readonly createUserUseCase: CreateUserUseCase,
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
}
