import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh optimizations
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic'
    }),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách vendor chunks để cache tốt hơn
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['antd', '@ant-design/icons'],
          'utils-vendor': ['axios', 'dayjs', 'moment'],
          'router-vendor': ['react-router-dom'],
          'state-vendor': [
            '@reduxjs/toolkit',
            'react-redux',
            '@tanstack/react-query'
          ],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'form-vendor': ['react-hook-form', 'react-color'],
          'ui-extras': ['react-slick', 'slick-carousel', 'react-helmet']
        },
        // Enhanced file naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            if (facadeModuleId.includes('node_modules')) {
              return 'vendor/[name]-[hash].js'
            }
            if (facadeModuleId.includes('/pages/')) {
              return 'pages/[name]-[hash].js'
            }
            if (facadeModuleId.includes('/components/')) {
              return 'components/[name]-[hash].js'
            }
          }
          return 'chunks/[name]-[hash].js'
        },
        entryFileNames: 'entry/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`
          }
          if (/\.(css)$/.test(assetInfo.name)) {
            return `styles/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        }
      }
    },
    // Tăng chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Minify với terser để có performance tốt hơn
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          'console.log',
          'console.info',
          'console.debug',
          'console.warn'
        ],
        reduce_vars: true,
        unused: true,
        dead_code: true
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    // Target modern browsers for better performance
    target: 'es2020',
    // CSS optimization
    cssCodeSplit: true,
    // Sourcemap for production debugging (disable for max performance)
    sourcemap: process.env.NODE_ENV === 'development' ? true : false,
    // Enable CSS minification
    cssMinify: true,
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Report bundle size
    reportCompressedSize: true
  },
  server: {
    host: true,
    // Preconnect để tăng tốc kết nối
    hmr: {
      overlay: false
    },
    // Enable gzip compression
    compress: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'antd',
      '@ant-design/icons',
      'axios',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      '@tanstack/react-query',
      'dayjs',
      'moment',
      'react-helmet',
      'lodash'
    ],
    // Force optimization for better performance
    force: false,
    // Optimize entry points
    entries: ['./src/main.tsx']
  },
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@store': resolve(__dirname, 'src/store'),
      '@apis': resolve(__dirname, 'src/apis'),
      '@config': resolve(__dirname, 'src/config'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  // CSS optimization
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // Antd theme customization
        modifyVars: {
          '@primary-color': '#1890ff',
          '@link-color': '#1890ff',
          '@success-color': '#52c41a',
          '@warning-color': '#faad14',
          '@error-color': '#f5222d'
        }
      }
    }
  },
  // Define constants for better tree shaking
  define: {
    __DEV__: true, // Will be replaced by Vite
    __PROD__: false // Will be replaced by Vite
  },
  // Enable experimental features
  experimental: {
    renderBuiltUrl: (filename) => {
      return '/' + filename
    }
  }
})
