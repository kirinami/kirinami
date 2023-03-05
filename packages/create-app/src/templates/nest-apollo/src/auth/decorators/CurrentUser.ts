import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import getRequestFromContext from '@/common/helpers/getRequestFromContext';

const CurrentUser = createParamDecorator((data, context: ExecutionContext) => getRequestFromContext(context).user);

export default CurrentUser;
