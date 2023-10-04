import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';

import { User } from '@prisma/client';

import { UserModel } from '@/users/models/user.model';

import { CurrentUser } from './decorators/current-user';
import { JwtAccess } from './decorators/jwt-access';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthModel } from './models/auth.model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({
    type: UserModel,
  })
  @JwtAccess()
  @Get('current-user')
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @SerializeOptions({
    type: AuthModel,
  })
  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthModel> {
    const user = await this.authService.loginByCredentials(body);

    return this.authService.login(user);
  }

  @SerializeOptions({
    type: AuthModel,
  })
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<AuthModel> {
    const user = await this.authService.registerByCredentials(body);

    return this.authService.login(user);
  }

  @SerializeOptions({
    type: AuthModel,
  })
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<AuthModel> {
    const user = await this.authService.refreshTokenByCredentials(body);

    return this.authService.login(user);
  }
}
