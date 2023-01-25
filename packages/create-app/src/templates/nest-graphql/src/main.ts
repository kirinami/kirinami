import path from 'path';
import * as process from 'process';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import AppModule from './AppModule';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV !== 'production' ? false : undefined,
      crossOriginEmbedderPolicy: process.env.NODE_ENV !== 'production' ? false : undefined,
    })
  );

  await app
    .useStaticAssets(path.resolve('public'), {
      index: false,
    })
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: false,
      })
    )
    .enableShutdownHooks()
    .listen(process.env.POST || 3000, '0.0.0.0');
}

main().catch((err) => {
  process.stderr.write(err.stack);
  process.exit(1);
});
