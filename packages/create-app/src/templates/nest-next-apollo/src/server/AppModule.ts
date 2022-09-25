import path from 'path';

import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import AuthModule from './auth/AuthModule';
import TranslationsModule from './translations/TranslationsModule';
import UsersModule from './users/UsersModule';
import UtilsModule from './utils/UtilsModule';
import AppController from './AppController';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: path.resolve('graphql/scheme.graphql'),
    }),
    UtilsModule,
    AuthModule,
    TranslationsModule,
    UsersModule,
  ],
  providers: [],
  controllers: [AppController],
})
export default class AppModule {}
