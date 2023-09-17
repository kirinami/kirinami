import dns from 'node:dns';
import path from 'node:path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

dns.setDefaultResultOrder('ipv4first');

export default defineConfig(({ mode, command, ssrBuild }) => {
  const isDev = command === 'serve';
  const isSsr = isDev || ssrBuild;

  return {
    appType: isSsr ? 'custom' : 'spa',
    define: isSsr
      ? Object.entries(loadEnv(mode, process.cwd(), ''))
          .filter(([key]) => !(key in process.env))
          .reduce((env, [key, value]) => ({ ...env, [`import.meta.env.${key}`]: JSON.stringify(value) }), {})
      : {},
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

      {
        name: 'fastify',
        apply: 'serve',
        configureServer: async (vite) => {
          vite.middlewares.use(async (req, res, next) => {
            try {
              if (/^(?:\/@|\/node_modules|\/src)/.test(req.url)) {
                next();

                return;
              }

              const module = await vite.ssrLoadModule('./index.ts');
              const app = await module.create(vite);

              app.routing(req, res);
            } catch (err) {
              next();
            }
          });
        },
      },
    ],
  };
});
