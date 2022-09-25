import { Global, Module } from '@nestjs/common';

import PrismaService from './prisma/PrismaService';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export default class UtilsModule {}
