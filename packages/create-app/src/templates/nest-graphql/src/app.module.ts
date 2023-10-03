import process from 'node:process';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppResolver } from '@/app.resolver';

import { AuthModule } from './auth/auth.module';
import { TranslationsModule } from './translations/translations.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
    }),

    AuthModule,
    TranslationsModule,
    UsersModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
