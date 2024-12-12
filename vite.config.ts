import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'state-vendor': ['zustand'],
          'icons': ['lucide-react'],
          'date-utils': ['date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'chart.js',
      'react-chartjs-2',
      'lucide-react',
      'date-fns'
    ]
  },
  server: {
    host: true,
    port: 5173
  }
});