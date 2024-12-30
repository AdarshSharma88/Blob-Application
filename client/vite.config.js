import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://3.110.119.209:8080',  // Your backend API URL
        changeOrigin: true,
        secure: false,  // Set to true if your backend is using HTTPS
        rewrite: (path) => path.replace(/^\/api/, '')  // Removes '/api' prefix when sending to backend
      },
    },
  },
})
