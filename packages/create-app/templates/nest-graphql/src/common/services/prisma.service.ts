import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/prisma/pg';

import { Prisma, PrismaClient } from '@prisma/client';

const logger = new Logger('PrismaClient', {
  timestamp: true,
});

const options = {
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
  errorFormat: 'pretty',
} as const satisfies Prisma.PrismaClientOptions;

@Injectable()
export class PrismaService
  extends PrismaClient<typeof options, (typeof options)['log'][number]['level']>
  implements OnModuleInit, OnModuleDestroy
{
  readonly $drizzle;

  constructor() {
    super(options);

    this.$on('query', (event) => {
      logger.verbose(`${event.query} ~${event.duration}ms`);
    });

    this.$on('info', (event) => {
      logger.log(event.message);
    });

    this.$on('warn', (event) => {
      logger.warn(event.message);
    });

    this.$on('error', (event) => {
      logger.error(event.message);
    });

    this.$drizzle = this.$extends(drizzle());
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
