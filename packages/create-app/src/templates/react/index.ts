/// <reference types="vite/client" />

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import fastifyStatic from '@fastify/static';
import fastify, { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { render } from '@/entry-ssr';
import { renderStyles } from '@/utils/react/dev';

let app: FastifyInstance | undefined;

export async function start(vite?: ViteDevServer) {
  if (app) {
    return app;
  }

  app = await fastify({
    logger: {
      level: import.meta.env.PROD ? 'info' : 'warn',
      formatters: {
        level: (label) => ({ label }),
      },
    },
    disableRequestLogging: true,
  });

  await app.register(fastifyStatic, {
    root: path.resolve(import.meta.env.PROD ? '.vite/spa' : 'public'),
    index: false,
  });

  let template = '';

  app.setNotFoundHandler(async (req, reply) => {
    try {
      req.log.info({ req }, `request incoming`);

      if (import.meta.env.PROD) {
        template = template || (await fs.readFile(path.resolve('.vite/spa/index.html'), 'utf-8'));
      } else {
        template = await fs.readFile(path.resolve('./index.html'), 'utf-8');
        template = await vite!.transformIndexHtml(req.url, template);
      }

      const request = new Request(new URL(req.url, `${req.protocol}://${req.hostname}`), {
        method: req.method,
        headers: new Headers(req.headers as HeadersInit),
        body: req.method !== 'HEAD' && req.method !== 'GET' ? (req.body as BodyInit) : undefined,
      });

      console.time('render');
      const { router, head, root } = await render(request);
      console.timeEnd('render');

      console.time('styles');
      const styles = import.meta.env.PROD ? '' : await renderStyles(vite!, '/src/entry-ssr.tsx');
      console.timeEnd('styles');

      console.time('scripts');
      const scripts = '';
      console.timeEnd('scripts');

      console.time('html');
      const html = template
        .replace(/<html.*>/g, head.html)
        .replace(`<!-- inject-meta -->`, head.meta.join(''))
        .replace(/<title.*>.*<\/title>/g, head.title)
        .replace(`<!-- inject-styles -->`, styles)
        .replace(`<!-- inject-root -->`, root)
        .replace(`<!-- inject-scripts -->`, scripts);
      console.timeEnd('html');

      return await reply.status(router.status).header('Content-Type', 'text/html').send(html);
    } catch (err) {
      if (err instanceof Response && err.status >= 300 && err.status <= 399) {
        return await reply.status(err.status).redirect(err.headers.get('Location') || '/');
      }

      req.log.error({ req, err }, 'request error');

      if (err instanceof Error) {
        if (!import.meta.env.PROD) {
          vite!.ssrFixStacktrace(err);
        }

        return await reply.status(500).send(err.stack);
      }

      return await reply.status(500).send('Internal Server Error');
    } finally {
      req.log.info({ req, res: reply, responseTime: reply.getResponseTime() }, 'request completed');
    }
  });

  await app.ready();

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
