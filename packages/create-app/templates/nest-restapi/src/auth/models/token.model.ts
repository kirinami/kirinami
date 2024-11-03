import { Expose } from 'class-transformer';

export class TokenModel {
  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;
}
