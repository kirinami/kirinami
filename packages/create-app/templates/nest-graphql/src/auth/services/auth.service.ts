import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Prisma, User } from '@prisma/client';

import { CryptoService } from '@/common/services/crypto.service';
import { UsersService } from '@/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly usersService: UsersService,
  ) {}

  async loginByJwt(payload: { id: number }, accessToken: string) {
    const user = await this.usersService.findUserById(payload.id);

    if (!user.accessToken) {
      throw new UnauthorizedException();
    }

    const match = this.cryptoService.compare(accessToken, user.accessToken);

    if (!match) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async loginByCredentials(input: Pick<User, 'email' | 'password'>) {
    return this.usersService.findUserByCredentials(input);
  }

  async registerByCredentials(input: Prisma.UserCreateInput) {
    return this.usersService.createUser(input);
  }

  async refreshTokenByCredentials(input: { refreshToken: string }) {
    let id: number;
    try {
      ({ id } = await this.jwtService.verifyAsync(input.refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      }));
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findUserById(id);

    if (!user.refreshToken) {
      throw new UnauthorizedException();
    }

    const match = this.cryptoService.compare(input.refreshToken, user.refreshToken);

    if (!match) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      id: user.id,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    await this.usersService.updateUser(user.id, {
      accessToken: this.cryptoService.hash(accessToken),
      refreshToken: this.cryptoService.hash(refreshToken),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
