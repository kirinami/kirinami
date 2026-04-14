import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { send } from '@fastify/send';
import fastify, { FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import type { Manifest, ViteDevServer } from 'vite';

import { apiPlugin } from '@/api';
import { handler } from '@/entry.server';
import { serializeError, statusCodeFromError } from '@/utils/errors';
import { ejectScripts, ejectStyles } from '@/utils/lib/vite';

const BUILD_DIR = path.resolve('.build');
const PUBLIC_DIR = path.resolve(import.meta.env.PROD ? BUILD_DIR : '.', 'public');
const MANIFEST_FILE = path.resolve(PUBLIC_DIR, '.vite/manifest.json');

const STYLE_FILE_KEY = 'style.css';
const ENTRY_FILE_KEY = 'src/entry.client.tsx';

let appMemo: FastifyInstance | undefined;

export async function init(vite?: ViteDevServer) {
  if (appMemo) {
    await appMemo.ready();

    return appMemo;
  }

  const manifest = vite
    ? undefined
    : await fs.readFile(MANIFEST_FILE, 'utf8').then((content) => JSON.parse(content) as Manifest);

  const styleFile = manifest?.[STYLE_FILE_KEY]?.file;
  const entryFile = manifest?.[ENTRY_FILE_KEY]?.file ?? ENTRY_FILE_KEY;

  if (!entryFile) {
    throw new Error('Entry file not found in manifest');
  }

  const assets = {
    style: styleFile ? `/${styleFile}` : undefined,
    entry: `/${entryFile}`,
  };

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
      const response = await handler(
        new Request(url, {
          method: request.method,
          headers: request.headers as HeadersInit,
        }),
        assets,
      );

      if (vite) {
        const scripts = await ejectScripts(vite);
        const styles = await ejectStyles(vite, '/src/entry.client.tsx');

        const stream = response.clone().body?.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              const html = new TextDecoder().decode(chunk);

              if (html.includes('</head>')) {
                controller.enqueue(new TextEncoder().encode(html.replace('</head>', `${scripts}${styles}</head>`)));
              } else {
                controller.enqueue(chunk);
              }
            },
          }),
        );

        return await reply.send(
          new Response(stream, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          }),
        );
      }

      return await reply.send(response);
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
