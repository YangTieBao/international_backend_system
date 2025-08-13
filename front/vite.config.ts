
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react()],
    optimizeDeps: {
      include: ['axios'],
    },
    resolve: {
      alias: {
        '@': '/src',
        '@mod':'/src/modules'
      }
    },
    server: {
      host: '127.0.0.1',
      port: 5173
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/variables.scss' as *;`
        }
      }
    }
  };
});