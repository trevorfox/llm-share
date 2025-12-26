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
    minify: false, // Skip minification in dev for faster builds
    sourcemap: true, // Enable sourcemap in dev
    target: 'es2020',
    emptyOutDir: false,
  },
  define: {
    'process.env.NODE_ENV': '"development"',
  },
});

