import dns from 'node:dns';
import path from 'node:path';
import process from 'node:process';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import metadata from './metadata';

export async function create() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableShutdownHooks();

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

  app.useStaticAssets({
    root: path.resolve(process.env.NODE_ENV === 'production' ? 'dist/public' : 'public'),
    index: false,
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

  if (process.env.NODE_ENV !== 'production') {
    await SwaggerModule.loadPluginMetadata(metadata);

    SwaggerModule.setup(
      'docs',
      app,
      SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('API').setVersion('1.0').build()),
    );
  }

  return app;
}

export async function main() {
  dns.setDefaultResultOrder('ipv4first');

  const app = await create();

  await app.listen(3000, '0.0.0.0');
}

main().catch((err) => {
  process.stderr.write(err.stack);
  process.exit(1);
});
