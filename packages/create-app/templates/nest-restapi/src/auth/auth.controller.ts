import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '@prisma/client';

import { UserModel } from '@/users/models/user.model';

import { BearerAccess } from './decorators/bearer-access';
import { CurrentUser } from './decorators/current-user';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { RegisterInput } from './dto/register.input';
import { TokenModel } from './models/token.model';
import { AuthService } from './services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({
    type: UserModel,
  })
  @BearerAccess()
  @Get('current-user')
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @SerializeOptions({
    type: TokenModel,
  })
  @Post('login')
  async login(@Body() input: LoginInput): Promise<TokenModel> {
    const user = await this.authService.loginByCredentials(input);

    return this.authService.login(user);
  }

  @SerializeOptions({
    type: TokenModel,
  })
  @Post('register')
  async register(@Body() input: RegisterInput): Promise<TokenModel> {
    const user = await this.authService.registerByCredentials(input);

    return this.authService.login(user);
  }

  @SerializeOptions({
    type: TokenModel,
  })
  @Post('refresh-token')
  async refreshToken(@Body() input: RefreshTokenInput): Promise<TokenModel> {
    const user = await this.authService.refreshTokenByCredentials(input);

    return this.authService.login(user);
  }
}
