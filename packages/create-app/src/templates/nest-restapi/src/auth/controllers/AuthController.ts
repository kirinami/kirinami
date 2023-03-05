import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { type User } from '@/prisma/client';
import UserType from '@/users/types/UserType';

import LoginBody from '../args/bodies/LoginBody';
import RefreshTokenBody from '../args/bodies/RefreshTokenBody';
import RegisterBody from '../args/bodies/RegisterBody';
import CurrentUser from '../decorators/CurrentUser';
import JwtAccess from '../decorators/JwtAccess';
import AuthService from '../services/AuthService';
import AuthType from '../types/AuthType';

@Controller('auth')
@ApiTags('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @JwtAccess()
  @Get('current-user')
  @ApiOperation({ operationId: 'getCurrentUser' })
  async getCurrentUser(@CurrentUser() user: User) {
    return plainToInstance(UserType, user);
  }

  @Post('login')
  @ApiOperation({ operationId: 'login' })
  async login(@Body() body: LoginBody) {
    const user = await this.authService.loginByCredentials(body);
    const auth = await this.authService.generateNewTokensAndSaveTo(user);

    return plainToInstance(AuthType, auth);
  }

  @Post('register')
  @ApiOperation({ operationId: 'register' })
  async register(@Body() body: RegisterBody) {
    const user = await this.authService.registerByCredentials(body);
    const auth = await this.authService.generateNewTokensAndSaveTo(user);

    return plainToInstance(AuthType, auth);
  }

  @Post('refresh-token')
  @ApiOperation({ operationId: 'refreshToken' })
  async refreshToken(@Body() body: RefreshTokenBody) {
    const user = await this.authService.refreshTokenByCredentials(body);
    const auth = await this.authService.generateNewTokensAndSaveTo(user);

    return plainToInstance(AuthType, auth);
  }
}
