import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    open: false
  },
  preview: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'zustand'],
          'vendor-ui': ['lucide-react', 'framer-motion'],
          'vendor-echarts': ['echarts', 'echarts-for-react']
        }
      }
    }
  }
});
