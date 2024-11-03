import process from 'node:process';

import { ApolloServerPlugin } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AuthModule } from '@/auth/auth.module';
import { TranslationsModule } from '@/translations/translations.module';
import { UsersModule } from '@/users/users.module';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      autoSchemaFile: true,
      introspection: process.env.NODE_ENV !== 'production',
      playground: false,
      plugins: [
        process.env.NODE_ENV !== 'production' &&
          ApolloServerPluginLandingPageLocalDefault({
            version: 'latest',
            embed: {
              runTelemetry: false,
              endpointIsEditable: false,
            },
          }),
      ].filter((plugin): plugin is ApolloServerPlugin => !!plugin),
    }),

    AuthModule,
    TranslationsModule,
    UsersModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
