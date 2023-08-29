import dns from 'node:dns';
import path from 'node:path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

dns.setDefaultResultOrder('ipv4first');

export default defineConfig(({ mode, command, ssrBuild }) => {
  const isDev = command === 'serve';
  const isSsr = isDev || ssrBuild;

  const env = Object.entries(loadEnv(mode, path.resolve('.'), '')).reduce(
    (env, [key, value]) => ({ ...env, [`import.meta.env.${key}`]: JSON.stringify(value) }),
    {},
  );

  return {
    appType: isSsr ? 'custom' : 'spa',
    publicDir: false,
    define: isSsr ? env : {},
    resolve: {
      alias: {
        '@/': `${path.resolve('src')}/`,
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    build: {
      minify: false,
      outDir: path.resolve(`.build/${isSsr ? 'ssr' : 'spa'}`),
      rollupOptions: {
        input: isSsr ? path.resolve('./index.ts') : undefined,
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    test: {
      environment: 'happy-dom',
      passWithNoTests: true,
    },
    plugins: [
      react(),
      isDev && {
        name: 'fastify',
        configureServer: async (vite) => {
          vite.middlewares.use(async (req, res, next) => {
            if (/^(?:\/@|\/node_modules|\/src)/.test(req.url)) {
              return next();
            }

            const module = await vite.ssrLoadModule('./index.ts');
            const app = await module.start(vite);

            app.routing(req, res);
          });
        },
      },
    ],
  };
});
