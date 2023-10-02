import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { RolesAccessGuard } from '../guards/roles-access.guard';

export enum Role {
  Admin = 'Admin',
}

export function JwtAccess(roles?: string[]) {
  return applyDecorators(UseGuards(JwtAccessGuard, RolesAccessGuard), SetMetadata('roles', roles));
}
