import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 10000,
    proxy: {
      '/commandes': {
        target: 'https://python-api-prod.onrender.com',
        changeOrigin: true
      }
    }
  }
});
