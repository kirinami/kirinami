import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { TokensService } from '@/tokens/tokens.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {
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

    const user = await this.usersService.findOneById(payload.id);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
