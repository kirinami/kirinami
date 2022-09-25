import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import RolesAccessGuard from '../guards/RolesAccessGuard';

export default function RolesAccess(roles: string[]) {
  return applyDecorators(UseGuards(RolesAccessGuard), SetMetadata('roles', roles));
}
