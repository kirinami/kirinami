import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export default function getRequestFromContext(context: ExecutionContext) {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest();
  }

  if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req;
  }

  return {};
}
