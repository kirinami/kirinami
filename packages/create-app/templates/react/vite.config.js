import path from 'node:path';
import process from 'node:process';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import analyzer from 'vite-bundle-analyzer';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode, command, isSsrBuild }) => {
  const isDev = command === 'serve';
  const isSsr = isDev || isSsrBuild;

  return {
    appType: isSsr ? 'custom' : 'spa',
    define: isSsr
      ? Object.entries(loadEnv(mode, process.cwd(), ''))
          .filter(([key]) => !(key in process.env))
          .reduce((env, [key, value]) => ({ ...env, [`import.meta.env.${key}`]: JSON.stringify(value) }), {})
      : {},
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDev ? '[name]__[local]__[hash:base64:6]' : '[local]__[hash:base64:6]',
      },
    },
    build: {
      outDir: path.resolve('.build', isSsr ? 'server' : 'public'),
      emptyOutDir: true,
      copyPublicDir: !isSsr,
      cssCodeSplit: false,
      manifest: true,
      rollupOptions: {
        input: isSsr ? path.resolve('src/main.ts') : path.resolve('src/entry.client.tsx'),
      },
    },
    plugins: [
      analyzer({
        analyzerMode: 'static',
      }),
      tsconfigPaths(),
      tailwindcss(),
      react(),
      {
        name: 'fastify-plugin',
        apply: 'serve',
        configureServer: async (vite) => {
          vite.middlewares.use(async (request, response, next) => {
            try {
              if (/^\/(?:@|node_modules|src)/.test(request.originalUrl)) {
                next();

                return;
              }

              const module = await vite.ssrLoadModule('/src/main.ts');
              const app = await module.init(vite);

              app.routing(request, response);
            } catch (error) {
              next(error);
            }
          });
        },
      },
    ],
    server: {
      host: true,
    },
    test: {
      environment: 'happy-dom',
      passWithNoTests: true,
    },
  };
});
