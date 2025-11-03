import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  server: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    proxy: {
      '/api': 'http://localhost:5000',
      '/img': 'http://localhost:5000'
    }
  }
})
