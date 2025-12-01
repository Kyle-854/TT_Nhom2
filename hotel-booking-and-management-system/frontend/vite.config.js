import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Khi nào code gọi đến /api... nó sẽ tự nối vào cái target bên dưới
      '/api': {
        target: 'http://160.191.245.177:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})