import { Injectable, OnModuleInit } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NextServer } from 'next/dist/server/next';

import { PrismaClient } from './prisma.client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(server: NextServer, app: NestExpressApplication) {
    this.$on('beforeExit', async () => {
      await server.close();
      await app.close();
    });
  }
}
