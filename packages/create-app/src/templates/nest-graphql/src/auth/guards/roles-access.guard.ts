import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '@prisma/client';

import getRequestFromContext from '@/common/helpers/get-request-from-context';

@Injectable()
export class RolesAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  getRequest(context: ExecutionContext) {
    return getRequestFromContext(context);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[] | undefined>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const user: User | undefined = this.getRequest(context).user;

    if (!user) {
      return false;
    }

    return user.roles.some((role) => roles.includes(role));
  }
}
