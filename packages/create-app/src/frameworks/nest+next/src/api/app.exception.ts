import { ArgumentsHost, Catch, HttpServer } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RequestHandler } from 'next/dist/server/next';

@Catch()
export class AppExceptionFilter extends BaseExceptionFilter {
  constructor(protected requestHandler: RequestHandler, protected applicationRef?: HttpServer) {
    super(applicationRef);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();
    const url = this.applicationRef?.getRequestUrl?.(req) || '';

    if (!res.headersSent && !/^\/api(?:\/.*|$)/.test(url)) {
      return this.requestHandler(req, res);
    }

    return super.catch(exception, host);
  }
}
