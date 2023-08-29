/// <reference types="vite/client" />

import dns from 'node:dns';
import fs from 'node:fs/promises';
import { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import process from 'node:process';

import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import fastify, { FastifyBaseLogger, FastifyInstance, RawServerDefault } from 'fastify';
import type { ViteDevServer } from 'vite';

import { render } from '@/entry-ssr';
import { staticPlugin } from '@/utils/fastify';
import { ejectStyles } from '@/utils/vite';

dns.setDefaultResultOrder('ipv4first');

let appMemo:
  | FastifyInstance<
      RawServerDefault,
      IncomingMessage,
      ServerResponse<IncomingMessage>,
      FastifyBaseLogger,
      JsonSchemaToTsProvider
    >
  | undefined;

export async function start(vite?: ViteDevServer) {
  if (appMemo) {
    return appMemo;
  }

  const app = fastify({
    logger: {
      level: import.meta.env.PROD ? 'info' : 'warn',
      formatters: {
        level: (label) => ({ label }),
      },
    },
  }).withTypeProvider<JsonSchemaToTsProvider>();

  app.setNotFoundHandler((request, reply) =>
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    }),
  );

  await app.register(staticPlugin);

  let template = '';

  app.route({
    method: 'GET',
    url: '*',
    schema: {
      params: {
        type: 'object',
        required: ['*'],
        properties: {
          '*': { type: 'string' },
        },
      },
    } as const,
    handler: async (request, reply) => {
      const { method, url, headers, params, body } = request;

      try {
        return await reply.sendFile(params['*']);
      } catch (err) {
        request.log.debug(err);
      }

      try {
        if (import.meta.env.PROD) {
          template = template || (await fs.readFile(path.resolve('.build/spa/index.html'), 'utf-8'));
        } else {
          template = await fs.readFile(path.resolve('index.html'), 'utf-8');
          template = await vite!.transformIndexHtml(url, template);
        }

        const { router, head, root } = await render(
          new Request(new URL(url, import.meta.env.VITE_BASE_URL), {
            method,
            headers: new Headers(headers as HeadersInit),
            body: method !== 'HEAD' && method !== 'GET' ? (body as BodyInit) : undefined,
          }),
        );

        const styles = import.meta.env.PROD ? '' : await ejectStyles(vite!, '/src/entry-ssr.tsx');
        const scripts = '';

        const html = template
          .replace(/<html.*>/g, head.html)
          .replace(`<!-- inject-meta -->`, head.meta.join(''))
          .replace(/<title.*>.*<\/title>/g, head.title)
          .replace(`<!-- inject-styles -->`, styles)
          .replace(`<!-- inject-root -->`, root)
          .replace(`<!-- inject-scripts -->`, scripts);

        return await reply
          .status(router.status)
          .headers({
            'Content-Type': 'text/html',
          })
          .send(html);
      } catch (err) {
        if (err instanceof Response && err.status >= 300 && err.status <= 399) {
          reply.log.debug(err);

          return reply.status(err.status).redirect(err.headers.get('Location') || '/');
        }

        if (err instanceof Error) {
          vite?.ssrFixStacktrace(err);
        }

        throw err;
      }
    },
  });

  await app.ready();

  appMemo = app;

  return app;
}

if (import.meta.env.PROD) {
  start()
    .then((app) =>
      app.listen({
        host: '0.0.0.0',
        port: 5173,
      }),
    )
    .catch((err) => {
      process.stderr.write(err.stack);
      process.exit(1);
    });
}
