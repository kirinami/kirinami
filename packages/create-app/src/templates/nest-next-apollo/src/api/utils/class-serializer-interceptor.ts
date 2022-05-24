import { CallHandler, ClassSerializerInterceptor, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';

@Injectable()
export class MyClassSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType<GqlContextType>() === 'graphql') {
      const operation = context.getArgByIndex(3).operation.operation;
      if (operation === 'subscription') {
        return next.handle();
      }
    }

    return super.intercept(context, next);
  }
}
