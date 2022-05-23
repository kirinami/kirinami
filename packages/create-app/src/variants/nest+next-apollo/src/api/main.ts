import '../../env.config';

import 'reflect-metadata';

import path from 'path';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import next from 'next';

import { MyClassSerializerInterceptor } from './utils/class-serializer-interceptor';
import { AppExceptionFilter } from './app.exception';
import { AppModule } from './app.module';

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
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalFilters(new AppExceptionFilter(handler, app.get(HttpAdapterHost).httpAdapter));

  app.useGlobalInterceptors(new MyClassSerializerInterceptor(app.get(Reflector)));

  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Nest+Next Apollo Starter API')
      .setDescription('The Nest+Next Apollo Starter API documentation')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build(),
  ), {
    customSiteTitle: 'Nest+Next Apollo Starter API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
}

main()
  .catch(console.error);
