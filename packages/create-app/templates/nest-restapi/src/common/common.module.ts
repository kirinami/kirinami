import { Global, Module } from '@nestjs/common';

import { CryptoService } from './services/crypto.service';
import { PrismaService } from './services/prisma.service';

@Global()
@Module({
  providers: [CryptoService, PrismaService],
  exports: [CryptoService, PrismaService],
})
export class CommonModule {}
