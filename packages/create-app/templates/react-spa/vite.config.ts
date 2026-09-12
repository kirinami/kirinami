import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import analyzer from 'vite-bundle-analyzer';

export default defineConfig({
  resolve: {
    alias: [{ find: '@/', replacement: '/src/' }],
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    analyzer({
      analyzerMode: 'static',
    }),
  ],
});
