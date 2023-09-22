import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ElementPlus from 'unplugin-element-plus/vite';

// https://vitejs.dev/config/
export default defineConfig({
  css:{
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `
          @use "@/assets/styles/_variable.scss" as *;
          @use "@/assets/styles/_mixins.scss" as *;
        `
      }
    },
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  },
  
  plugins: [vue(), vueJsx(), ElementPlus({
    useSource: true
  })],
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.tsx'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // 解决打包时Some chunks are larger警告
        // eslint-disable-next-line consistent-return
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        }
      }
    }
  },
  esbuild: {
    treeShaking: true,
    drop: ['debugger', 'console']
  },
  server: {
    open: true,
    host: '0.0.0.0',
     // 设置 https 代理  4个端口 
     proxy:{
      // 带选项写法：http://localhost:5173/api/bar -> http://192.168.0.228/bar
      '/api': {
        target: 'http://topo.shanyuan1.wise-insightapm.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
     }
  }
  // build: {
  //   minify: 'esbuild',
  //   terserOptions: {
  //     // 生产环境移除console
  //     compress: {
  //       drop_console: true,
  //       drop_debugger: true,
  //     },
  //   },
  // },
})
