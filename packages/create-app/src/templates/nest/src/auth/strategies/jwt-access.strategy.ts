import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      passReqToCallback: true,
    });
  }

  async validate(req: FastifyRequest, payload: { id: number }) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req as never);

    if (!accessToken) throw new UnauthorizedException();

    return this.authService.loginByJwt(payload, accessToken);
  }
}
