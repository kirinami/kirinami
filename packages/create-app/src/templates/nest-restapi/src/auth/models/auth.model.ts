import { Expose } from 'class-transformer';

export class AuthModel {
  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;
}
