import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imagetools()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  define: {
    // GA4 Measurement ID — public value, safe to expose in bundle
    __GA4_ID__: JSON.stringify(process.env.VITE_GA4_ID ?? ''),
  },
  build: {
    // Modern JS/CSS only — no legacy polyfills; matches NFR-P4 bundle budget
    target: ['chrome120', 'safari17', 'firefox121'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
