import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { User } from '@/prisma/client';
import UsersService from '@/users/services/UsersService';

import LoginInput from '../args/inputs/LoginInput';
import RefreshTokenInput from '../args/inputs/RefreshTokenInput';
import RegisterInput from '../args/inputs/RegisterInput';

@Injectable()
export default class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

  async loginByJwt(payload: { id: number }, accessToken: string) {
    const user = await this.usersService.findUserById(payload.id);

    if (!user || !user.accessToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(accessToken, user.accessToken);

    if (!match) throw new UnauthorizedException();

    return user;
  }

  async loginByCredentials(input: LoginInput) {
    return this.usersService.findUserByCredentials(input);
  }

  async registerByCredentials(input: RegisterInput) {
    return this.usersService.createUser(input);
  }

  async refreshTokenByCredentials(input: RefreshTokenInput) {
    let id: number;
    try {
      ({ id } = this.jwtService.verify(input.refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      }));
    } catch (err) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findUserById(id);

    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(input.refreshToken, user.refreshToken);

    if (!match) throw new UnauthorizedException();

    return user;
  }

  async generateNewTokensAndSaveTo(user: User) {
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

    await this.usersService.updateUser(user.id, {
      accessToken: bcrypt.hashSync(accessToken, 10),
      refreshToken: bcrypt.hashSync(refreshToken, 10),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
