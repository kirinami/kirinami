const { default: swc } = require('unplugin-swc');
const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    include: ['test/**/*.e2e-{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '@/': 'src/',
    },
  },
  plugins: [swc.vite()],
});
