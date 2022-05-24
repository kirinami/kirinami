import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import bcrypt from 'bcryptjs';

import { TokensService } from '@/tokens/tokens.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromHeader('refresh-token'),
        ExtractJwt.fromBodyField('refreshToken'),
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { id: number }) {
    const jwtToken = ExtractJwt.fromExtractors([
      ExtractJwt.fromHeader('refresh-token'),
      ExtractJwt.fromBodyField('refreshToken'),
    ])(req);
    if (!jwtToken) throw new UnauthorizedException();

    const refreshToken = await this.tokensService.get(payload.id, 'refreshToken');
    if (!refreshToken) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(jwtToken, refreshToken.value);
    if (!isMatch) throw new UnauthorizedException();

    const user = await this.usersService.findOneById(payload.id);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
