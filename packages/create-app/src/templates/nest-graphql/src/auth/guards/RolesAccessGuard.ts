import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import getRequestFromContext from '@/common/helpers/getRequestFromContext';

@Injectable()
export default class RolesAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  getRequest(context: ExecutionContext) {
    return getRequestFromContext(context);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[] | undefined>('roles', [context.getHandler(), context.getClass()]);

    if (!roles) {
      return true;
    }

    const { user } = this.getRequest(context);

    if (!user) return false;

    return roles.some((role) => user.roles.includes(role));
  }
}
