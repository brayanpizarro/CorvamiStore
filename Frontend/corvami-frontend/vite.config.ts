import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todas las rutas de la API se redirigen al backend en :6000
      // El navegador hace requests a localhost:5174/api/* y Vite las reenvía
      '/auth': { target: 'http://localhost:6000', changeOrigin: true },
      '/productos': { target: 'http://localhost:6000', changeOrigin: true },
      '/cart': { target: 'http://localhost:6000', changeOrigin: true },
      '/orders': { target: 'http://localhost:6000', changeOrigin: true },
      '/users': { target: 'http://localhost:6000', changeOrigin: true },
    },
  },
})
