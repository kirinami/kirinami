import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  resolve: {
    alias: [
      { find: /^@\/(.+)/, replacement: path.join(process.cwd(), 'src/$1') },
    ],
  },
  plugins: [react({
    jsxImportSource: '@emotion/react',
  })],
});
