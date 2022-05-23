import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAccess } from '@/auth/decorators/jwt-access.decorator';

import { UsersService } from './users.service';
import { User } from './user.entity';

@ApiTags('users')
@JwtAccess()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string' },
      },
    },
  })
  @ApiQuery({
    name: 'relations',
    type: 'string',
    isArray: true,
    style: 'form',
    explode: false,
    required: false,
    allowEmptyValue: false,
  })
  @Get('profile')
  async retrieveProfile(@CurrentUser() user: User, @Query('relations') relations?: string) {
    return this.usersService.findOneById(user.id, relations?.split(',').map((r) => r.trim()).filter(Boolean));
  }
}
