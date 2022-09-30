import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  esbuild: {
    minify: true
  },
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: 'LaboratoriaTechSupportWidget',
      formats: ['es', 'umd', 'iife'],
    },
  },
});
