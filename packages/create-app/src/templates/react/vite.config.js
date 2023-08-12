import path from 'node:path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { cjsInterop } from 'vite-plugin-cjs-interop';

export default defineConfig(({ command, ssrBuild }) => ({
  appType: command === 'serve' || ssrBuild ? 'custom' : 'spa',
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
    outDir: path.resolve(`.vite/${ssrBuild ? 'ssr' : 'spa'}`),
    rollupOptions: {
      input: command === 'serve' || ssrBuild ? path.resolve('./index.ts') : undefined,
    },
  },
  test: {
    environment: 'happy-dom',
    passWithNoTests: true,
  },
  plugins: [
    cjsInterop({
      dependencies: [],
    }),
    react(),
    command === 'serve' && {
      name: 'fastify',
      configureServer: async (server) => {
        server.middlewares.use(async (req, res, next) => {
          if (/^(?:\/@|\/node_modules|\/src)/.test(req.url)) {
            return next();
          }

          const module = await server.ssrLoadModule('./index.ts');
          const app = await module.start(server);

          app.routing(req, res);
        });
      },
    },
  ],
}));
