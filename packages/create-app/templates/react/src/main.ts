import fs from 'node:fs/promises';
import { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import process from 'node:process';

import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import fastify, { FastifyBaseLogger, FastifyInstance, RawServerDefault } from 'fastify';
import type { Manifest, ViteDevServer } from 'vite';

import { api } from '@/api';
import { render } from '@/entry.server';
import { ejectStyles } from '@/utils/vite';
import { send } from '@fastify/send';

const BUILD_DIR = path.resolve('.build');
const PUBLIC_DIR = path.resolve(import.meta.env.PROD ? BUILD_DIR : '.', 'public');
const MANIFEST_FILE = path.resolve(PUBLIC_DIR, '.vite/manifest.json');

let appMemo:
  | FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse, FastifyBaseLogger, JsonSchemaToTsProvider>
  | undefined;

export async function init(vite?: ViteDevServer) {
  if (appMemo) {
    await appMemo.ready();

    return appMemo;
  }

  const manifest: Manifest = import.meta.env.DEV
    ? {}
    : await fs.readFile(MANIFEST_FILE, 'utf8').then((content) => JSON.parse(content));

  const app = fastify({
    logger: {
      level: import.meta.env.PROD ? 'info' : 'warn',
      formatters: {
        level: (label) => ({ label }),
      },
    },
    disableRequestLogging: true,
  }).withTypeProvider<JsonSchemaToTsProvider>();

  app.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({
      message: 'Not Found',
    });
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    reply.status(500).send(
      error instanceof Error
        ? {
            message: import.meta.env.DEV ? error.message : 'Unknown Error',
            stack: import.meta.env.DEV ? error.stack : undefined,
          }
        : {
            message: import.meta.env.DEV ? String(error) : 'Unknown Error',
          },
    );
  });

  await app.register(api, {
    prefix: '/api',
  });

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
      const pathname = request.params['*'];

      if (pathname.includes('.')) {
        const { type, statusCode, headers, stream } = await send(request.raw, encodeURI(pathname), {
          root: PUBLIC_DIR,
          index: false,
          maxAge: pathname.startsWith('/assets') ? 31536000 : 0,
        });

        if (type === 'file') {
          return reply.status(statusCode).headers(headers).send(stream);
        }

        reply.callNotFound();

        return;
      }

      try {
        const injections = {
          head: {
            end: [
              vite && (await vite.transformIndexHtml('/', '')),
              vite &&
                (await ejectStyles(vite, `/src/entry.client.tsx`).then((styles) =>
                  styles.map((style) => `<style type="text/css" data-vite-dev-id="${style.id}">${style.css}</style>`),
                )),
              manifest['style.css'] && `<link rel="stylesheet" href="/${manifest['style.css'].file}" />`,
            ]
              .flat()
              .filter((value) => value != null)
              .join(''),
          },
          body: {
            end: [
              manifest['src/entry.client.tsx']
                ? `<script type="module" src="/${manifest['entry.client.tsx'].file}"></script>`
                : `<script type="module" src="/src/entry.client.tsx"></script>`,
            ]
              .flat()
              .filter((value) => value != null)
              .join(''),
          },
        };

        const { statusCode, html } = await render(
          new Request(new URL(request.url, import.meta.env.VITE_BASE_URL), {
            method: request.method,
            headers: request.headers as HeadersInit,
          }),
        );

        return reply
          .status(statusCode)
          .type('text/html; charset=utf-8')
          .send(
            html
              .replace('</head>', `${injections.head.end}</head>`)
              .replace('</body>', `${injections.body.end}</body>`),
          );
      } catch (error) {
        if (error instanceof Response) {
          return reply.send(error);
        }

        if (error instanceof Error) {
          vite?.ssrFixStacktrace(error);
        }

        throw error;
      }
    },
  });

  appMemo = app;

  await app.ready();

  return app;
}

export async function main() {
  const app = await init();

  await app.listen({
    host: '0.0.0.0',
    port: 5173,
  });
}

if (import.meta.env.PROD) {
  main().catch((error) => {
    process.stderr.write(String(error));
    process.exit(1);
  });
}
