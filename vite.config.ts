import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  server: { port: 5173, proxy: { '/tasks': 'http://localhost:4000' } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('@tanstack/react-query') || id.includes('/axios/')) return 'data'
          if (id.includes('/radix-ui/') || id.includes('/@radix-ui/')) return 'radix'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react'
          return undefined
        },
      },
    },
  },
})
