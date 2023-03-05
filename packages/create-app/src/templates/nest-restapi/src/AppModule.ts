import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import AuthModule from './auth/AuthModule';
import TranslationsModule from './translations/TranslationsModule';
import UsersModule from './users/UsersModule';
import AppController from './AppController';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),

    TranslationsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export default class AppModule {}
