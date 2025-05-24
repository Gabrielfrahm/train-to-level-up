import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSendCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class AuthValidateCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  session: string;
}
