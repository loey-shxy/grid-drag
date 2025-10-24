import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), dts()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@packages': resolve(__dirname, './packages/src')
    }
  },
  server: {
    port: 3000,
  },
  build: {
    // minify: false,  // 调试时关闭压缩
    outDir: 'lib',
    sourcemap: false,
    lib: {
      entry: resolve(__dirname, './packages/index.ts'),
      name: 'grid-drag',
      fileName: 'grid-drag'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue', 
        '@arco-design/web-vue', 
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
        // 静态资源分类打包
        chunkFileNames: 'static/js/[name]-[hash].js'
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer
      ]
    }
  }
})
