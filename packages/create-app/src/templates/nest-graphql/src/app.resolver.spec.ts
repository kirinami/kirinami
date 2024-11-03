import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let appResolver: AppResolver;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [AppService, AppResolver],
    }).compile();

    appResolver = testingModule.get<AppResolver>(AppResolver);
  });

  describe('getHealth', () => {
    it('should return "OK"', () => {
      expect(appResolver.health()).toBe('OK');
    });
  });
});
