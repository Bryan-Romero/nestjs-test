export interface JwtPayload {
  sub: string;
  email: string;
}

export interface JwtForgotPassPayload {
  sub: string;
  email: string;
}
