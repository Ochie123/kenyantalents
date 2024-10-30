export type ClaimsType = {
  user_id(user_id: any): unknown;
  readonly email: string;
  readonly iat: number;
  readonly exp: number;
  readonly sub: string;
};
