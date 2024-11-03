import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { BearerGuard } from '../guards/bearer.guard';

export enum Role {
  Admin = 'Admin',
}

export function BearerAccess(roles?: Role[]) {
  return applyDecorators(UseGuards(BearerGuard), SetMetadata('roles', roles));
}
