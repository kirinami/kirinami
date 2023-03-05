import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export default class AppController {
  @Get()
  @ApiOperation({ operationId: 'hello' })
  hello() {
    return 'Hello world';
  }
}
