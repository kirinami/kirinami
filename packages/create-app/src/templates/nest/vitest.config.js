const { default: swc } = require('unplugin-swc');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '@/': 'src/',
    },
  },
  plugins: [swc.vite()],
});
