import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, ExecutionContext, HttpServer } from '@nestjs/common';
import { RequestHandler } from 'next/dist/server/next';

import { getRequestFromContext } from './utils/get-request-from-context';

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly requestHandler: RequestHandler, applicationRef?: HttpServer) {
    super(applicationRef);
  }

  catch(exception: unknown, context: ExecutionContext) {
    const type = context.getType<string>();
    const req = getRequestFromContext(context);
    const res = context.switchToHttp().getResponse();
    const url = req.originalUrl || req.url;

    if (!res?.headersSent && !/^\/api(?:\/.*|$)/.test(url)) {
      return this.requestHandler(req, res);
    }

    if (type === 'http') {
      return super.catch(exception, context);
    }
  }
}
