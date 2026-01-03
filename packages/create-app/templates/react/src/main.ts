import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { send } from '@fastify/send';
import fastify, { FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import type { ManifestChunk, ViteDevServer } from 'vite';

import { apiPlugin } from '@/api';
import { render } from '@/entry.server';
import { serializeError, statusCodeFromError } from '@/utils/errors';
import { ejectScripts, ejectStyles } from '@/utils/lib/vite';

const BUILD_DIR = path.resolve('.build');
const PUBLIC_DIR = path.resolve(import.meta.env.PROD ? BUILD_DIR : '.', 'public');
const MANIFEST_FILE = path.resolve(PUBLIC_DIR, '.vite/manifest.json');

let appMemo: FastifyInstance | undefined;

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

  const entryClient = manifest['src/entry.client.tsx'];

  if (!entryClient) {
    throw new Error('Entry client not found in manifest');
  }

  const app = fastify({
    logger: {
      level: import.meta.env.PROD ? 'info' : 'warn',
      formatters: {
        level: (label) => ({ label }),
      },
    },
    disableRequestLogging: true,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({
      message: 'Not Found',
    });
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    reply.status(statusCodeFromError(error)).send(serializeError(error));
  });

  await app.register(apiPlugin, {
    prefix: '/api',
  });

  app.get('*', async (request, reply) => {
    const url = new URL(request.originalUrl, import.meta.env.VITE_BASE_URL);

    if (url.pathname.includes('.')) {
      const { type, statusCode, headers, stream } = await send(request.raw, url.pathname, {
        root: PUBLIC_DIR,
        index: false,
        maxAge: url.pathname.startsWith('/assets') ? 31536000 : 0,
      });

      if (type === 'file') {
        return reply.status(statusCode).headers(headers).send(stream);
      }

      reply.callNotFound();

      return;
    }

    try {
      const response = await render(
        new Request(url, {
          method: request.method,
          headers: request.headers as HeadersInit,
        }),
      );

      if (response instanceof Response) {
        return await reply.send(response);
      }

      const { html, statusCode } = response;

      const head = [
        vite && (await ejectScripts(vite, '/')),
        vite && (await ejectStyles(vite, `/${entryClient.file}`)),
        manifest['style.css'] && `<link rel="stylesheet" href="/${manifest['style.css'].file}" />`,
      ]
        .flat()
        .filter((value) => !!value)
        .join('');

      const body = `<script type="module" src="/${entryClient.file}"></script>`;

      return await reply
        .status(statusCode)
        .type('text/html; charset=utf-8')
        .send(html.replace('</head>', `${head}</head>`).replace('</body>', `${body}</body>`));
    } catch (error) {
      if (error instanceof Error) {
        vite?.ssrFixStacktrace(error);
      }

      throw error;
    }
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
