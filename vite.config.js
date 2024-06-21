import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const port = process.env.PORT || 10000;

export default defineConfig({
  plugins: [vue()],
  server: {
    port: port,
    host: '0.0.0.0',
    proxy: {
      '/commandes': {
        target: 'https://python-api-prod.onrender.com',
        changeOrigin: true
      }
    }
  }
});
