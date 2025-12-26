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
        // Ensure UMD build has proper global name
        globals: {},
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debug mode
      },
    },
    sourcemap: true,
    target: 'es2020',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
