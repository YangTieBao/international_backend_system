import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {

  return {
    plugins: [
      react()
    ],
    optimizeDeps: {
      include: ['axios'],
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    server: {
      host: '127.0.0.1'
    }
  }
})