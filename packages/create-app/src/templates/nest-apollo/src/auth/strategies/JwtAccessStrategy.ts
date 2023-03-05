import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import UsersService from '@/users/services/UsersService';

import AuthService from '../services/AuthService';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { id: number }) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!accessToken) throw new UnauthorizedException();

    return this.authService.loginByJwt(payload, accessToken);
  }
}
