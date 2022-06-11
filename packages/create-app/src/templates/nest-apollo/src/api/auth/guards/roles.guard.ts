import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Role } from '@/api/users/enums/role.enum';
import { getRequestFromContext } from '@/api/utils/get-request-from-context';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  getRequest(context: ExecutionContext) {
    return getRequestFromContext(context);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const { user } = this.getRequest(context);

    if (!user) return false;

    return roles.some((role) => user.roles.includes(role));
  }
}
