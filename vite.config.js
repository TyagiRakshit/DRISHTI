import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind(),
  ],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    host: true // Expose to network if needed
  }
})
