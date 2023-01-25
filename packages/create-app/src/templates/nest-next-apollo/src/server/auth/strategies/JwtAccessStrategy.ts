import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import UsersService from '@/server/users/UsersService';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { id }: { id: number }) {
    const jwtToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!jwtToken) throw new UnauthorizedException();

    const user = await this.usersService.findUserById(id);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
