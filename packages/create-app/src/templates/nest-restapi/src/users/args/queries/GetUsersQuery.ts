import { ApiPropertyOptional } from '@nestjs/swagger';

export default class GetUsersQuery {
  @ApiPropertyOptional()
  page: number = 1;

  @ApiPropertyOptional()
  size: number = 10;
}
