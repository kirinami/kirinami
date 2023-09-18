import dns from 'node:dns';
import path from 'node:path';
import process from 'node:process';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

import tsConfig from './tsconfig.json';

export default defineConfig(({ mode, command, ssrBuild }) => {
  dns.setDefaultResultOrder('ipv4first');

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
      alias: Object.entries(tsConfig.compilerOptions.paths).map(([key, [value]]) => ({
        find: key.replace('*', ''),
        replacement: path.resolve(value.replace('*', '')) + '/',
      })),
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    build: {
      outDir: path.resolve('dist', isSsr ? 'server' : 'public'),
      copyPublicDir: !isSsr,
      rollupOptions: {
        input: ssrBuild && path.resolve('src/main.ts'),
      },
    },
    server: {
      host: true,
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

              const module = await vite.ssrLoadModule('/src/main.ts');
              const app = await module.create(vite);

              app.routing(req, res);
            } catch (err) {
              next(err);
            }
          });
        },
      },
    ],
  };
});
