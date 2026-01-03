import fs from 'node:fs/promises';
import { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import process from 'node:process';

import { send } from '@fastify/send';
import fastify, { FastifyBaseLogger, FastifyInstance, RawServerDefault } from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import type { ManifestChunk, ViteDevServer } from 'vite';
import { z } from 'zod';

import { apiPlugin } from '@/api';
import { render } from '@/entry.server';
import { ejectStyles } from '@/utils/ejectStyles';

const BUILD_DIR = path.resolve('.build');
const PUBLIC_DIR = path.resolve(import.meta.env.PROD ? BUILD_DIR : '.', 'public');
const MANIFEST_FILE = path.resolve(PUBLIC_DIR, '.vite/manifest.json');

let appMemo:
  | FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse, FastifyBaseLogger, ZodTypeProvider>
  | undefined;

export async function init(vite?: ViteDevServer) {
  if (appMemo) {
    await appMemo.ready();

    return appMemo;
  }

  const manifest: Record<string, ManifestChunk | undefined> = vite
    ? {
        'src/entry.client.tsx': {
          file: 'src/entry.client.tsx',
        },
      }
    : await fs
        .readFile(MANIFEST_FILE, 'utf8')
        .then((content) => JSON.parse(content) as Record<string, ManifestChunk | undefined>);

  const app = fastify({
    logger: {
      level: import.meta.env.PROD ? 'info' : 'warn',
      formatters: {
        level: (label) => ({ label }),
      },
    },
    disableRequestLogging: true,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({
      message: 'Not Found',
    });
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error && typeof error === 'object') {
      return reply
        .status(('statusCode' in error && typeof error.statusCode === 'number' && error.statusCode) || 500)
        .send({
          message: ('message' in error && typeof error.message === 'string' && error.message) || 'Unknown Error',
          stack:
            (import.meta.env.DEV && 'stack' in error && typeof error.stack === 'string' && error.stack) || undefined,
        });
    }

    reply.status(500).send({
      message: 'Internal Server Error',
    });
  });

  await app.register(apiPlugin, {
    prefix: '/api',
  });

  app.route({
    method: 'GET',
    url: '*',
    schema: {
      params: z.object({
        '*': z.string(),
      }),
    },
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
        const { statusCode, html } = await render(
          new Request(new URL(request.url, import.meta.env.VITE_BASE_URL), {
            method: request.method,
            headers: request.headers as HeadersInit,
          }),
        );

        const entryClient = manifest['src/entry.client.tsx'];

        if (!entryClient) {
          throw new Error('Entry client not found in manifest');
        }

        const head = [
          vite && [
            await vite.transformIndexHtml('/', ''),
            await ejectStyles(vite, `/${entryClient.file}`).then((styles) =>
              styles.map((style) => `<style type="text/css" data-vite-dev-id="${style.id}">${style.css}</style>`),
            ),
          ],
          manifest['style.css'] && `<link rel="stylesheet" href="/${manifest['style.css'].file}" />`,
        ]
          .flat(2)
          .filter((value) => !!value)
          .join('');

        const body = `<script type="module" src="/${entryClient.file}"></script>`;

        return await reply
          .status(statusCode)
          .type('text/html; charset=utf-8')
          .send(html.replace('</head>', `${head}</head>`).replace('</body>', `${body}</body>`));
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
  main().catch((error: unknown) => {
    process.stderr.write(String(error));
    process.exit(1);
  });
}
