import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

export function JwtRefresh() {
  return applyDecorators(
    UseGuards(JwtRefreshGuard),
    ApiBody({
      schema: {
        properties: {
          refreshToken: { type: 'string' },
        },
        required: ['refreshToken'],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string' },
        },
      },
    }),
  );
}
