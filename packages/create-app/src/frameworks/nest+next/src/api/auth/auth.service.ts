import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { TokensService } from '@/api/tokens/tokens.service';
import { User } from '@/api/users/user.entity';
import { UsersService } from '@/api/users/users.service';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {
  }

  async login(user: User) {
    const payload = {
      id: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.tokensService.set(payload.id, 'accessToken', await bcrypt.hash(accessToken, 10));
    await this.tokensService.set(payload.id, 'refreshToken', await bcrypt.hash(refreshToken, 10));

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    return this.login(user);
  }
}
