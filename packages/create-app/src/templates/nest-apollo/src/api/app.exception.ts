import { BaseExceptionFilter } from '@nestjs/core';
import { Catch, ExecutionContext, type HttpServer } from '@nestjs/common';
import { type RequestHandler } from 'next/dist/server/next';

import { getRequestFromContext } from './utils/get-request-from-context';

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly requestHandler: RequestHandler, applicationRef?: HttpServer) {
    super(applicationRef);
  }

  catch(exception: unknown, context: ExecutionContext) {
    const type = context.getType<string>();

    if (type === 'http') {
      const req = getRequestFromContext(context);
      const res = context.switchToHttp().getResponse();
      const url = req.originalUrl || req.url;

      if (!res?.headersSent && !/^\/api(?:\/.*|$)/.test(url)) {
        return this.requestHandler(req, res);
      }

      return super.catch(exception, context);
    }
  }
}
