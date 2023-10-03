import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, beforeEach, describe, it } from 'vitest';

import { AppModule } from '@/app.module';

describe('AppResolver (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('getHello', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `
          query {
            getHello
          }
        `,
        variables: {},
      })
      .expect(200)
      .expect({
        data: {
          getHello: 'Hello World!',
        },
      });
  });
});
