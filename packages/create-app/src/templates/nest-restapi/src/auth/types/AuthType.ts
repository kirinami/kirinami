import { Expose } from 'class-transformer';

export default class AuthType {
  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;
}
