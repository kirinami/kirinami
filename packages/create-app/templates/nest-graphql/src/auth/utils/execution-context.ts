import { IncomingMessage } from 'node:http';

import { ExecutionContext, NotImplementedException } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';
import { Context } from 'graphql-ws';

export function getRequestFromExecutionContext<Data extends { [K in keyof Data]: Data[K] }>(context: ExecutionContext) {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest<FastifyRequest & Data>();
  }

  if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext<{
      req: (
        | FastifyRequest
        | Context<
            Record<string, string | string[] | undefined>,
            {
              request: IncomingMessage;
            }
          >
      ) &
        Data;
    }>().req;
  }

  throw new NotImplementedException();
}

export function setUserToExecutionContext<User extends { [K in keyof User]: User[K] }>(
  user: User,
  context: ExecutionContext,
) {
  const request = getRequestFromExecutionContext<{ user?: unknown }>(context);

  request.user = user;

  return true;
}

export function getUserFromExecutionContext<User extends { [K in keyof User]: User[K] }>(context: ExecutionContext) {
  const request = getRequestFromExecutionContext(context);

  return 'user' in request ? (request.user as User) : null;
}

export function extractBearerTokenFromExecutionContext(context: ExecutionContext) {
  const request = getRequestFromExecutionContext(context);

  let authorization = '';

  if ('headers' in request) {
    authorization = String(request.headers.authorization ?? request.headers.Authorization ?? '');
  } else if ('subscriptions' in request) {
    authorization = String(
      request.connectionParams?.authorization ??
        request.connectionParams?.Authorization ??
        request.extra.request.headers.authorization ??
        request.extra.request.headers.authorization ??
        '',
    );
  }

  const [type, token] = authorization.split(' ');

  return type === 'Bearer' ? token : undefined;
}
