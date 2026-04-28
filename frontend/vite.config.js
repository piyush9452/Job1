import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split Framer Motion into its own chunk
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            // Split React and React Router into their own chunk
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // Split Icons into their own chunk
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            // Put all other third-party libraries in a generic vendor chunk
            return 'vendor';
          }
        }
      }
    }
  }
})