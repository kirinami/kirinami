import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { type User } from '@/prisma/client';
import PrismaService from '@/server/utils/prisma/PrismaService';

import LoginInput from './dto/LoginInput';
import RegisterInput from './dto/RegisterInput';

@Injectable()
export default class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}

  private async generateAndSaveTokens(user: User) {
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

    await this.prismaService.user.update({
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
    const user = await this.prismaService.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!user) throw new UnauthorizedException();

    const match = await bcrypt.compare(input.password, user.password);
    if (!match) throw new UnauthorizedException();

    return this.generateAndSaveTokens(user);
  }

  async register(input: RegisterInput) {
    const password = await bcrypt.hash(input.password, 10);

    const user = await this.prismaService.user.create({
      data: { ...input, password },
    });

    return this.generateAndSaveTokens(user);
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

    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(token, user.refreshToken);
    if (!match) throw new UnauthorizedException();

    return this.generateAndSaveTokens(user);
  }
}
