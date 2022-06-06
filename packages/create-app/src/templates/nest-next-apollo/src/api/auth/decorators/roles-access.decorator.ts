import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { Role } from '@/api/users/user.entity';

import { RolesGuard } from '../guards/roles.guard';

export function RolesAccess(roles: Role[]) {
  return applyDecorators(
    UseGuards(RolesGuard),
    SetMetadata('roles', roles),
  );
}
