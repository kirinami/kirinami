import dns from 'node:dns';
import fs from 'node:fs/promises';
import { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import process from 'node:process';

import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import fastify, { FastifyBaseLogger, FastifyInstance, RawServerDefault } from 'fastify';
import mime from 'mime';
import type { ViteDevServer } from 'vite';

import { render } from '@/entry-ssr';
import { ejectStyles } from '@/utils/vite';

let appMemo:
  | FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  JsonSchemaToTsProvider
>
  | undefined;

export async function create(vite?: ViteDevServer) {
  if (appMemo) {
    return appMemo;
  }

  const app = fastify({
    logger: {
      level: 'info',
      formatters: {
        level: (label) => ({ label }),
      },
    },
    disableRequestLogging: true,
  }).withTypeProvider<JsonSchemaToTsProvider>();

  const template = await fs.readFile(import.meta.env.PROD ? '.build/spa/index.html' : 'index.html', 'utf-8');

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
      const slug = request.params['*'];

      if (slug.includes('.')) {
        try {
          const file = path.join(import.meta.env.PROD ? '.build/spa' : 'public', slug);
          const type = mime.getType(file) || 'application/octet-stream';

          const stat = await fs.stat(file);

          const content = await fs.readFile(file);

          return await reply
            .status(200)
            .headers({
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'public, max-age=0',
              'Content-Length': stat.size,
              'Content-Type': type,
              ETag: `W/"${stat.size.toString(16)}-${stat.mtime.getTime().toString(16)}"`,
              'Last-Modified': stat.mtime.toUTCString(),
            })
            .send(content);
        } catch (err) {
          // skip
        }
      }

      try {
        const { router, head, root } = await render(
          new Request(new URL(request.url, import.meta.env.VITE_BASE_URL), {
            method: request.method,
            headers: request.headers as HeadersInit,
          }),
        );

        const html = import.meta.env.PROD ? template : await vite!.transformIndexHtml(request.url, template);
        const styles = import.meta.env.PROD ? '' : await ejectStyles(vite!, '/src/entry-ssr.tsx');
        const scripts = '';

        return await reply
          .status(router.status)
          .type('text/html')
          .send(
            html
              .replace(/<html.*>/g, head.html)
              .replace(`<!-- inject-meta -->`, head.meta.join(''))
              .replace(/<title.*>.*<\/title>/g, head.title)
              .replace(`<!-- inject-styles -->`, styles)
              .replace(`<!-- inject-scripts -->`, scripts)
              .replace(`<!-- inject-root -->`, root),
          );
      } catch (err) {
        if (err instanceof Response && err.status >= 300 && err.status <= 399) {
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

export async function main() {
  dns.setDefaultResultOrder('ipv4first');

  const app = await create();

  await app.listen({
    host: '0.0.0.0',
    port: 5173,
  });
}

if (import.meta.env.PROD) {
  main().catch((err) => {
    process.stderr.write(err.stack);
    process.exit(1);
  });
}
