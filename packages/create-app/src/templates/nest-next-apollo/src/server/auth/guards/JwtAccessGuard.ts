import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import getRequestFromContext from '@/server/utils/helpers/getRequestFromContext';

@Injectable()
export default class JwtAccessGuard extends AuthGuard('jwt-access') {
  getRequest(context: ExecutionContext) {
    return getRequestFromContext(context);
  }
}
