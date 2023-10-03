import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';

import { User } from '@prisma/client';

import { UserEntity } from '@/users/entities/user.entity';

import { CurrentUser } from './decorators/current-user';
import { JwtAccess } from './decorators/jwt-access';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthEntity } from './entities/auth.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({
    type: UserEntity,
  })
  @JwtAccess()
  @Get('current-user')
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @SerializeOptions({
    type: AuthEntity,
  })
  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthEntity> {
    const user = await this.authService.loginByCredentials(body);

    return this.authService.login(user);
  }

  @SerializeOptions({
    type: AuthEntity,
  })
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<AuthEntity> {
    const user = await this.authService.registerByCredentials(body);

    return this.authService.login(user);
  }

  @SerializeOptions({
    type: AuthEntity,
  })
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<AuthEntity> {
    const user = await this.authService.refreshTokenByCredentials(body);

    return this.authService.login(user);
  }
}
