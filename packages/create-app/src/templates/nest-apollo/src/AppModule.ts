import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
    }),

    TranslationsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export default class AppModule {}
