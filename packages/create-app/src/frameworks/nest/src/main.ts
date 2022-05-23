import '../env.config';

import 'reflect-metadata';

import path from 'path';
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Nest Starter API')
      .setDescription('The Nest Starter API documentation')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build(),
  ), {
    customSiteTitle: 'Nest Starter API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
}

main()
  .catch(console.error);
