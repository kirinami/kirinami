import dns from 'node:dns';
import path from 'node:path';
import process from 'node:process';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import metadata from './metadata';

export async function main() {
  dns.setDefaultResultOrder('ipv4first');

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableShutdownHooks();

  app.useStaticAssets({
    root: path.resolve(process.env.NODE_ENV === 'production' ? '.build/public' : 'public'),
    index: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
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

    SwaggerModule.setup('swagger', app, () =>
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder().setTitle('RestAPI')
          .setDescription('The RestAPI description')
          .setVersion('0.0.1')
          .addBearerAuth()
          .build(),
        {
          operationIdFactory: (controllerKey, methodKey) => methodKey
        }
      ),
      {
        swaggerOptions: {
          persistAuthorization: true,
        }
      }
    );
  }

  await app.listen({
    host: '0.0.0.0',
    port: 3000,
  });
}

main().catch((error) => {
  process.stderr.write((error instanceof Error && (error.stack ?? error.message)) || String(error));
  process.exit(1);
});
