/// <reference types="vite/client" />

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import fastifyCompress from '@fastify/compress';
import fastifyStatic from '@fastify/static';
import fastify, { FastifyInstance } from 'fastify';
import type { ViteDevServer } from 'vite';

import { render } from './src/entry-ssr';
import { renderToStyles } from './src/utils/react/ssr';

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

  if (import.meta.env.PROD) {
    await app.register(fastifyCompress);
    await app.register(fastifyStatic, {
      root: path.resolve('.vite/spa'),
      index: false,
    });
  } else {
    await app.register(fastifyStatic, {
      root: path.resolve('public'),
      index: false,
    });
  }

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

      const { router, helmet, html } = await render(request);

      let styles = '';

      if (!import.meta.env.PROD) {
        styles = await renderToStyles(vite!, '/src/entry-ssr.tsx');
      }

      return await reply
        .status(router.statusCode)
        .header('Content-Type', 'text/html')
        .send(
          template
            .replace(/^<(html).*>$/g, `<$1 ${helmet.htmlAttributes.toString()}>`)
            .replace(/^<(body).*>$/g, `<$1 ${helmet.bodyAttributes.toString()}>`)
            .replace(`<!-- inject-base -->`, helmet.base.toString())
            .replace(`<!-- inject-priority -->`, helmet.priority.toString())
            .replace(`<!-- inject-meta -->`, helmet.meta.toString())
            .replace(/^<title.*>.*<\/title>$/g, helmet.title.toString())
            .replace(`<!-- inject-link -->`, helmet.link.toString())
            .replace(`<!-- inject-style -->`, styles + helmet.style.toString())
            .replace(`<!-- inject-script -->`, helmet.script.toString())
            .replace(`<!-- inject-noscript -->`, helmet.noscript.toString())
            .replace(`<!-- inject-html -->`, html),
        );
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
