import path from 'path';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { Request } from 'express';

import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
})
export class AppModule {
}
