import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import JwtAccessGuard from '../guards/JwtAccessGuard';
import RolesAccessGuard from '../guards/RolesAccessGuard';

export default function JwtAccess(roles?: string[]) {
  return applyDecorators(UseGuards(JwtAccessGuard), UseGuards(RolesAccessGuard), SetMetadata('roles', roles));
}
