import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';

import { AppModule } from '@/app.module';

describe('AppController (e2e)', () => {
  let testingModule: TestingModule;
  let app: NestExpressApplication;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = await testingModule.createNestApplication<NestExpressApplication>().init();
  });

  afterAll(async () => testingModule?.close());

  it('/ (GET)', () => (
    request(app.getHttpServer())
      .get('/')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Cannot GET /',
        error: 'Not Found',
      })
  ));
});
