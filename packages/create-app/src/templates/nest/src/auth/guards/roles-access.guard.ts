import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '@prisma/client';

@Injectable()
export class RolesAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[] | undefined>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    let user: User | undefined;

    if (context.getType() === 'http') {
      user = context.switchToHttp().getRequest().user;
    }

    if (!user) {
      return false;
    }

    return user.roles.some((role) => roles.includes(role));
  }
}
