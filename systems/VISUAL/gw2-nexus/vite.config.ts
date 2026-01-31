import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/Anuu_Verse/gw2money/' : './',
  server: {
    proxy: {
      '/gw2api': {
        target: 'https://api.guildwars2.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gw2api/, '/v2'),
        secure: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].${Date.now()}.js`,
        chunkFileNames: `assets/[name].${Date.now()}.js`,
        assetFileNames: `assets/[name].${Date.now()}.[ext]`,
      },
    },
  },
})
