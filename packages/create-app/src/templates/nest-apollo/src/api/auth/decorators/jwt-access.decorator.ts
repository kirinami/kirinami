import { applyDecorators, UseGuards } from '@nestjs/common';

import { JwtAccessGuard } from '../guards/jwt-access.guard';

export function JwtAccess() {
  return applyDecorators(UseGuards(JwtAccessGuard));
}
