import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { Role } from '@/api/users/enums/role.enum';

import { RolesGuard } from '../guards/roles.guard';

export function RolesAccess(roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(RolesGuard),
  );
}
