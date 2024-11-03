import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserModel } from '@/users/models/user.model';

import { getUserFromExecutionContext } from '../utils/execution-context';

export const CurrentUser = createParamDecorator((data, context: ExecutionContext) =>
  getUserFromExecutionContext<UserModel>(context),
);
