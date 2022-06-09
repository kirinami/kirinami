import 'dotenv/config';
import 'reflect-metadata';

import path from 'path';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import next from 'next';

import { PrismaService } from './api/prisma/prisma.service';
import { MyClassSerializerInterceptor } from './api/utils/my-class-serializer-interceptor';
import { AppExceptionFilter } from './api/app.exception';
import { AppModule } from './api/app.module';

const server = next({
  dev: process.env.NODE_ENV !== 'production',
});
const handler = server.getRequestHandler();

async function main() {
  await server.prepare();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix('api');

  app.useStaticAssets(path.resolve('public'), {
    index: false,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.useGlobalFilters(new AppExceptionFilter(handler, app.get(HttpAdapterHost).httpAdapter));

  app.useGlobalInterceptors(new MyClassSerializerInterceptor(app.get(Reflector)));

  await app.get(PrismaService).enableShutdownHooks(app);

  await app.listen(3000, '0.0.0.0');
}

main()
  .catch(console.error);
