import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { type User } from '@/api/prisma/prisma.client';
import { UsersService } from '@/api/users/users.service';

import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
  }

  private async computeTokens(user: User) {
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

    await this.usersService.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: bcrypt.hashSync(accessToken, 10),
        refreshToken: bcrypt.hashSync(refreshToken, 10),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput) {
    const user = await this.usersService.findOne({
      where: {
        email: input.email,
      },
    });

    if (!user) throw new UnauthorizedException();

    const match = await bcrypt.compare(input.password, user.password);

    if (!match) throw new UnauthorizedException();

    return this.computeTokens(user);
  }

  async register(input: RegisterInput) {
    const user = await this.usersService.create({
      data: input,
    });

    return this.computeTokens(user);
  }

  async refresh(token: string) {
    let id: number;
    try {
      ({ id } = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      }));
    } catch (err) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne({
      where: {
        id,
      },
    });

    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(token, user.refreshToken);

    if (!match) throw new UnauthorizedException();

    return this.computeTokens(user);
  }
}
