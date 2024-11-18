import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Det betyder, at når din frontend laver et API-kald til /api/products, bliver det automatisk proxied til min backend, der kører på http://localhost:5001.
    // Start backend-serveren ved at køre npx nodemon server.js i backend-mappen.
    //Start frontend-serveren ved at køre npm run dev i src-mappen.
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
})
