import { Expose, Type } from 'class-transformer';

import UserType from '../UserType';

export default class UsersPaginationType {
  @Expose()
  @Type(() => UserType)
  users!: UserType[];

  @Expose()
  total!: number;
}
