import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, 'packages/src/index.ts'),
      name: 'GridDrag',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: [
        {
          format: 'es',
          entryFileNames: 'index.es.js',
          exports: 'named',
          assetFileNames: 'style.css'
        },
        {
          format: 'umd',
          entryFileNames: 'index.umd.js',
          name: 'GridDrag',
          exports: 'named',
          globals: {
            vue: 'Vue'
          },
          assetFileNames: 'style.css'
        }
      ]
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'terser'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages/src')
    }
  }
})