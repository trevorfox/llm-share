import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/loader.ts'),
      name: 'LLMShareLoader',
      fileName: () => 'loader.js',
      formats: ['iife'],
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console in loader
      },
    },
    sourcemap: false, // No sourcemap for loader to keep it tiny
    target: 'es2020',
    emptyOutDir: false, // Don't clear dist when building loader
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

