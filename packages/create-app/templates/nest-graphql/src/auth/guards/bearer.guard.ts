import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../services/auth.service';
import { extractBearerTokenFromExecutionContext, setUserToExecutionContext } from '../utils/execution-context';

@Injectable()
export class BearerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const accessToken = extractBearerTokenFromExecutionContext(context);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ id: number }>(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      const user = await this.authService.loginByJwt(payload, accessToken);

      const roles = this.reflector.getAllAndOverride<string[] | undefined>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);

      if (roles && !user.roles.some((role) => roles.includes(role))) {
        throw new ForbiddenException();
      }

      return setUserToExecutionContext(user, context);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new UnauthorizedException();
    }
  }
}
