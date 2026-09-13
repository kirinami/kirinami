import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import compress from '@fastify/compress';
import { send } from '@fastify/send';
import fastify, { FastifyInstance, LogController } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import type { Manifest, ViteDevServer } from 'vite';

import { handler } from '@/entry.server';
import { todosApi } from '@/features/todos/api';
import { getStatusFromError, serializeError } from '@/lib/errors';
import { extractScripts, extractStyles } from '@/lib/vite';

const BUILD_DIR = path.resolve('.build');
const PUBLIC_DIR = path.resolve(import.meta.env.PROD ? BUILD_DIR : '.', 'public');
const MANIFEST_FILE = path.resolve(PUBLIC_DIR, '.vite/manifest.json');

const STYLE_FILE_KEY = 'style.css';
const ENTRY_FILE_KEY = 'src/entry.client.tsx';

let appMemo: FastifyInstance | undefined;

export async function create(vite?: ViteDevServer) {
  if (appMemo) {
    await appMemo.ready();

    return appMemo;
  }

  const manifest = vite
    ? { [ENTRY_FILE_KEY]: { file: ENTRY_FILE_KEY } }
    : (JSON.parse(await fs.readFile(MANIFEST_FILE, 'utf-8')) as Manifest);

  const assets = {
    fonts: Object.entries(manifest)
      .filter(([key]) => key.endsWith('.ttf'))
      .map(([, value]) => `/${value.file}`),
    styles: manifest[STYLE_FILE_KEY]?.file ? [`/${manifest[STYLE_FILE_KEY].file}`] : [],
    modules: [`/${manifest[ENTRY_FILE_KEY].file}`],
  };

  const app = fastify({
    logger: {
      level: import.meta.env.PROD ? 'info' : 'warn',
      formatters: {
        level: (label) => ({ label }),
      },
    },
    logController: new LogController({
      disableRequestLogging: true,
    }),
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

    reply.status(getStatusFromError(error)).send(serializeError(error));
  });

  await app.register(compress, {
    global: true,
    encodings: ['gzip', 'deflate', 'br'],
  });

  await app.register(todosApi, { prefix: '/api/todos' });

  app.get('/api/health', () => ({
    message: 'OK',
  }));

  app.get('*', async (request, reply) => {
    const url = new URL(import.meta.env.VITE_BASE_URL + request.originalUrl);

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
        assets,
        new Request(url, {
          method: request.method,
          headers: request.headers as HeadersInit,
        }),
      );

      reply.status(response.status).headers(Object.fromEntries(response.headers));

      if (vite) {
        const scripts = await extractScripts(vite);
        const styles = await extractStyles(vite, assets.modules[0]);

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

        return await reply.send(stream);
      }

      return await reply.send(response.body);
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
  const app = await create();

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
