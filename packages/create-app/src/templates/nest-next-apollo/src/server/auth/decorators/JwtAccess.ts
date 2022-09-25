import { applyDecorators, UseGuards } from '@nestjs/common';

import JwtAccessGuard from '../guards/JwtAccessGuard';

export default function JwtAccess() {
  return applyDecorators(UseGuards(JwtAccessGuard));
}
