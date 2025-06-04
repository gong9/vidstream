import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/config': {
        target: 'http://localhost:80',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
