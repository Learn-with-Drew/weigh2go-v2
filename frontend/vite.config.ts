/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In Docker the backend is reachable at http://backend:8000 (set in compose.yaml);
// when running `npm run dev` directly on your machine it's on this machine.
const apiTarget = process.env.VITE_PROXY_TARGET ?? 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globalSetup: './tests/globalSetup.ts',
    setupFiles: './tests/setup.ts',
    globals: true,
  },
})