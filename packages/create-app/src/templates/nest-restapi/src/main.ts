import path from 'path';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import AppModule from './AppModule';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    cors: true,
  });

  SwaggerModule.setup(
    'swagger',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Nest RestAPI')
        .setDescription('The Nest RestAPI description')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build()
    ),
    {
      swaggerOptions: {
        persistAuthorization: true,
      },
    }
  );

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
        transformOptions: {
          enableImplicitConversion: true,
        },
        forbidUnknownValues: false,
      })
    )
    .useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), {
        strategy: 'excludeAll',
        exposeDefaultValues: true,
        exposeUnsetFields: false,
      })
    )
    .enableShutdownHooks()
    .listen(process.env.POST || 3000, '0.0.0.0');
}

main().catch((err) => {
  process.stderr.write(err.stack);
  process.exit(1);
});
