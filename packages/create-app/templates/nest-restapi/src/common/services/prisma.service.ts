import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/prisma/pg';

import { Prisma, PrismaClient } from '@prisma/client';

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
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name, {
    timestamp: true,
  });

  readonly $drizzle = this.$extends(drizzle()).$drizzle;

  constructor() {
    super(options);

    this.$on('query', (event) => this.logger.verbose(`${event.query} ~${event.duration}ms`));

    this.$on('info', (event) => this.logger.log(event.message));

    this.$on('warn', (event) => this.logger.warn(event.message));

    this.$on('error', (event) => this.logger.error(event.message));
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
