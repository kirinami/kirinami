import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, context: ExecutionContext) => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }

  return null;
});
