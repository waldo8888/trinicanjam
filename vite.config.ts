import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      imagetools({
        // Apply w=800&format=webp to all image imports by default, removing the
        // need for query strings in TypeScript source (which tsc cannot type-check).
        defaultDirectives: new URLSearchParams('w=800&format=webp'),
      }),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    define: {
      // GA4 Measurement ID — public value, safe to expose in bundle
      __GA4_ID__: JSON.stringify(env.VITE_GA4_ID ?? ''),
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
  }
})
