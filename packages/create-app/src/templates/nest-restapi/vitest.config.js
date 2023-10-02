const path = require('node:path');

const { defineConfig } = require('vitest/config');
const { default: swc } = require('unplugin-swc');

module.exports = defineConfig({
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
