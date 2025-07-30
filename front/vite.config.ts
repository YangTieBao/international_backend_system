
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; 

export default defineConfig(() => {
  return {
    plugins: [react()], 
    optimizeDeps: {
      include: ['axios'], 
    },
    resolve: {
      alias: {
        '@': '/src' 
      }
    },
    server: {
      host: '127.0.0.1',
      port: 5173 
    }
  };
});