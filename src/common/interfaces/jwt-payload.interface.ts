export interface JwtPayload {
  uuid: string;
  role: 'admin' | 'guru' | string;
}
