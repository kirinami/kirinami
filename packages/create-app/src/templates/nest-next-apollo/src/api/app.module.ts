import path from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';
import { DataSource } from 'typeorm';

import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_USER,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      synchronize: false,
      logging: ['warn', 'error'],
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': {
          context: (context: { connectionParams: Record<string, string> | null, extra: { request: Request } }) => {
            context.extra.request.headers = Object.fromEntries(Object.entries(context?.connectionParams || {})
              .map(([key, value]) => [key.toLowerCase(), value]));

            return { req: context.extra.request };
          },
        },
        'subscriptions-transport-ws': {
          onConnect: (params: Record<string, string> | null, ws: { upgradeReq: Request }) => {
            ws.upgradeReq.headers = Object.fromEntries(Object.entries(params || {})
              .map(([key, value]) => [key.toLowerCase(), value]));

            return { req: ws.upgradeReq };
          },
        },
      },
      introspection: true,
      playground: true,
      autoSchemaFile: path.resolve('scheme.graphql'),
    }),
    AuthModule,
    TodosModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {
  }
}
