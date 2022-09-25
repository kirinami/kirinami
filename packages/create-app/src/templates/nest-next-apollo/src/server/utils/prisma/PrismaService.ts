import { Injectable, OnModuleInit } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { PrismaClient } from '@/prisma/client';

@Injectable()
export default class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: NestExpressApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
