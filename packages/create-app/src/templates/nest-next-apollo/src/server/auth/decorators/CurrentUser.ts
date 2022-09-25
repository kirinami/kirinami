import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import getRequestFromContext from '@/server/utils/helpers/getRequestFromContext';

const CurrentUser = createParamDecorator((data, context: ExecutionContext) => getRequestFromContext(context).user);

export default CurrentUser;
