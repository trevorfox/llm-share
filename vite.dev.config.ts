import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.ts'),
      name: 'LLMShareWidget',
      fileName: (format) => `widget.${format}.js`,
      formats: ['umd', 'iife', 'es'],
    },
    rollupOptions: {
      output: {
        globals: {},
      },
    },
    minify: false, // Skip minification in dev for faster builds
    sourcemap: true,
    target: 'es2020',
  },
  define: {
    'process.env.NODE_ENV': '"development"',
  },
});

