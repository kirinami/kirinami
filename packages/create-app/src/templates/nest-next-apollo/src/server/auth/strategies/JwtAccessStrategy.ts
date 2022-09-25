import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import PrismaService from '@/server/utils/prisma/PrismaService';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { id: number }) {
    const jwtToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!jwtToken) throw new UnauthorizedException();

    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
