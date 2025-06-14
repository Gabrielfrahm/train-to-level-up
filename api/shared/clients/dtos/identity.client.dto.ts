export interface ISendCodeInput {
  session: string;
  email: string;
}

export interface IValidateCodeOutput {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: string;
  typeToken: string;
}
