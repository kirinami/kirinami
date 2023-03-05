import { Controller, Get } from '@nestjs/common';

@Controller()
export default class AppController {
  @Get()
  hello() {
    return 'Hello world';
  }
}
