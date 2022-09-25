import 'reflect-metadata';

import path from 'path';

import next from 'next';
import { ExecutionContext, ValidationPipe } from '@nestjs/common';
import { BaseExceptionFilter, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import AppModule from './server/AppModule';

const server = next({
  dev: process.env.NODE_ENV !== 'production',
});
const requestHandler = server.getRequestHandler();

async function main() {
  await server.prepare();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: process.env.NODE_ENV !== 'production',
  });

  app.useStaticAssets(path.resolve('public'), {
    index: false,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.useGlobalFilters({
    catch(exception: unknown, context: ExecutionContext) {
      if (context.getType() !== 'http') {
        return;
      }

      const http = context.switchToHttp();

      const req = http.getRequest();
      const res = http.getResponse();

      const url = req.originalUrl || req.url;

      if (!res.headersSent && !/^\/(?:api|graphql)(?:\/.*|$)/.test(url)) {
        requestHandler(req, res);
      } else {
        new BaseExceptionFilter(app.getHttpAdapter()).catch(exception, context);
      }
    },
  });

  await app.listen(3000, '0.0.0.0');
}

main().catch(console.error);
