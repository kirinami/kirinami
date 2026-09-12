import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig(({ mode, command }) => ({
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: command === 'serve' ? '[name]__[local]__[hash:base64:6]' : '[local]__[hash:base64:6]',
    },
  },
  build: {
    emptyOutDir: true,
    cssCodeSplit: false,
    manifest: true,
  },
  server: {
    host: true,
  },
  environments: {
    ssr: {
      consumer: 'server',
      keepProcessEnv: true,
      build: {
        outDir: './.build/server',
        copyPublicDir: false,
        rolldownOptions: {
          input: './src/main.ts',
        },
      },
    },
    client: {
      consumer: 'client',
      keepProcessEnv: true,
      build: {
        outDir: './.build/public',
        rolldownOptions: {
          input: './src/entry.client.tsx',
        },
      },
    },
  },
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    analyzer({
      analyzerMode: 'static',
    }),
    {
      name: 'fastify-dev-server',
      apply: 'serve',
      configureServer: async (vite) => {
        vite.middlewares.use(async (request, response, next) => {
          try {
            if (
              !request.url ||
              request.url.startsWith('/@') ||
              request.url.startsWith('/node_modules/') ||
              request.url.startsWith('/src/')
            ) {
              next();

              return;
            }

            const module = await vite.ssrLoadModule('/src/main.ts');
            const app = await module.create(vite);

            app.routing(request, response);
          } catch (error) {
            next(error);
          }
        });
      },
    },
  ],
  test: {
    environment: 'happy-dom',
    passWithNoTests: true,
  },
}));
