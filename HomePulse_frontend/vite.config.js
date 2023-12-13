import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host: true,
    strictPort: true,
    port : 3001,
    proxy:{
      '/socket.io': {
        target: 'http://homepulse_websocket:3002',
        ws: true,
        changeOrigin: true
      }
    }
  },
  plugins: [react()],
})