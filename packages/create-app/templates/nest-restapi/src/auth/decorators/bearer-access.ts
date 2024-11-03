import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { BearerGuard } from '../guards/bearer.guard';

export enum Role {
  Admin = 'Admin',
}

export function BearerAccess(roles?: Role[]) {
  return applyDecorators(ApiBearerAuth(), UseGuards(BearerGuard), SetMetadata('roles', roles));
}
