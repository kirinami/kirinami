import dns from 'node:dns';
import path from 'node:path';
import process from 'node:process';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

export async function main() {
  dns.setDefaultResultOrder('ipv4first');

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableShutdownHooks();

  // app
  //   .getHttpAdapter()
  //   .getInstance()
  //   .addHook('onRequest', (req) => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     req.socket.encrypted = process.env.NODE_ENV === 'production';
  //
  //     console.log(req.socket.encrypted);
  //   })
  //   .decorateReply('setHeader', function setHeader(name: string, value: unknown) {
  //     this.header(name, value);
  //   })
  //   .decorateReply('end', function end() {
  //     this.send('');
  //   });

  app.useStaticAssets({
    root: path.resolve(process.env.NODE_ENV === 'production' ? '.build/public' : 'public'),
    index: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen({
    host: '0.0.0.0',
    port: 3000,
  });
}

main().catch((error) => {
  process.stderr.write((error instanceof Error && (error.stack ?? error.message)) || String(error));
  process.exit(1);
});
