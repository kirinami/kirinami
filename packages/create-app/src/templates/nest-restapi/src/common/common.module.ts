import { Module } from '@nestjs/common';

import { CryptoService } from './services/crypto.service';
import { PrismaService } from './services/prisma.service';

@Module({
  providers: [CryptoService, PrismaService],
  exports: [CryptoService, PrismaService],
})
export class CommonModule {}
