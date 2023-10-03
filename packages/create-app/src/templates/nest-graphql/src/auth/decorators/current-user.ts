import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import getRequestFromContext from '@/common/helpers/get-request-from-context';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => getRequestFromContext(context).user,
);
