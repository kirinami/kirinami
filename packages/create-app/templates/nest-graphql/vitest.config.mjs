import path from 'node:path';

import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve('src')}/`,
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.ts'],
    passWithNoTests: true,
  },
  plugins: [swc.vite()],
});
