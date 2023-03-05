import { ExecutionContext } from '@nestjs/common';

export default function getRequestFromContext(context: ExecutionContext) {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest();
  }

  return {};
}
