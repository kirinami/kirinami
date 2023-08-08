import { Expose } from 'class-transformer';

export class AuthEntity {
  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;
}
