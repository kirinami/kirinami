import { applyDecorators, UseGuards } from '@nestjs/common';

import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

export function JwtRefresh() {
  return applyDecorators(UseGuards(JwtRefreshGuard));
}
