import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import getRequestFromContext from '@/common/helpers/get-request-from-context';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  getRequest(context: ExecutionContext) {
    return getRequestFromContext(context);
  }
}
