import path from 'node:path';
import process from 'node:process';

import fastifyStatic from '@fastify/static';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function start() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableShutdownHooks();

  await app.register(fastifyStatic, {
    root: path.resolve('./public'),
    index: false,
  });

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', async (req, _res) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.socket.encrypted = process.env.NODE_ENV === 'production';
    })
    .decorateReply('setHeader', function setHeader(name: string, value: unknown) {
      this.header(name, value);
    })
    .decorateReply('end', function end() {
      this.send('');
    });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  return app;
}

start()
  .then((app) => app.listen(3000, '0.0.0.0'))
  .catch((err) => {
    process.stderr.write(err.stack);
    process.exit(1);
  });
