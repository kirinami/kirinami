import { Controller, Get, SerializeOptions } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BearerAccess, Role } from '@/auth/decorators/bearer-access';

import { UserModel } from './models/user.model';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @SerializeOptions({
    type: UserModel,
  })
  @BearerAccess([Role.Admin])
  @Get()
  async getUsers(): Promise<UserModel[]> {
    return [];
  }
}
