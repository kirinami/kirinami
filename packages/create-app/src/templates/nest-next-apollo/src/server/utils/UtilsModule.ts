import { Global, Module } from '@nestjs/common';

import PrismaService from './services/PrismaService';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export default class UtilsModule {}
