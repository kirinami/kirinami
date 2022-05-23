import '../env.config';

import 'reflect-metadata';

import path from 'path';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { MyClassSerializerInterceptor } from './utils/class-serializer-interceptor';
import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(path.resolve('public'), {
    index: false,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalInterceptors(new MyClassSerializerInterceptor(app.get(Reflector)));

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Nest Apollo Starter API')
      .setDescription('The Nest Apollo Starter API documentation')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build(),
  ), {
    customSiteTitle: 'Nest Apollo Starter API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
}

main()
  .catch(console.error);
