import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import JwtAccess from '@/auth/decorators/JwtAccess';

import CreateUserBody from '../args/bodies/CreateUserBody';
import UpdateUserBody from '../args/bodies/UpdateUserBody';
import GetUsersQuery from '../args/queries/GetUsersQuery';
import UsersService from '../services/UsersService';
import UsersPaginationType from '../types/pagination/UsersPaginationType';
import UserType from '../types/UserType';

@JwtAccess(['Admin'])
@Controller('users')
@ApiTags('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ operationId: 'getUsers' })
  async getUsers(@Query() { page, size }: GetUsersQuery): Promise<UsersPaginationType> {
    const [users, total] = await this.usersService.findManyPagination(page, size);

    return plainToInstance(UsersPaginationType, {
      users,
      total,
    });
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getUserById' })
  async getUserById(@Param('id') id: number): Promise<UserType> {
    const user = await this.usersService.findUserById(id);

    return plainToInstance(UserType, user);
  }

  @Post()
  @ApiOperation({ operationId: 'createUser' })
  async createUser(@Body() body: CreateUserBody): Promise<UserType> {
    const user = await this.usersService.createUser(body);

    return plainToInstance(UserType, user);
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateUser' })
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserBody): Promise<UserType> {
    const user = await this.usersService.updateUser(id, body);

    return plainToInstance(UserType, user);
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteUser' })
  async deleteUser(@Param('id') id: number): Promise<UserType> {
    const user = await this.usersService.deleteUser(id);

    return plainToInstance(UserType, user);
  }
}
