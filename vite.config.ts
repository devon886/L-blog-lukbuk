import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 优化配置
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 将React相关库打包到一个chunk
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react';
          }
          // 将路由相关库打包到一个chunk
          if (id.includes('react-router-dom')) {
            return 'router';
          }
          // 将Supabase相关库打包到一个chunk
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          // 将TinyMCE相关库打包到一个chunk（如果使用了）
          if (id.includes('@tinymce')) {
            return 'tinymce';
          }
        },
      },
    },
    // 启用更高级的压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 启用sourcemap（生产环境可选）
    sourcemap: false,
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用预加载
    modulePreload: true,
    // 启用预压缩
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
  },
  
  // 静态资源处理
  assetsInclude: ['**/*.md'],
  
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
})
