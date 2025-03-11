import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000', // replace with your backend URL
    },
  },
  resolve: {
    alias: {
      'latex.js': 'latex.js/dist/latex.mjs'
    }
  }
})
