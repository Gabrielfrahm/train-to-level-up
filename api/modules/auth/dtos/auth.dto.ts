import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSendCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class AuthSendCodeOutputDto {
  @IsString()
  session: string;
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

export class AuthValidateCodeOutputDto {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
  @IsString()
  idToken: string;
  @IsString()
  expiresIn: string;
  @IsString()
  typeToken: string;
}
