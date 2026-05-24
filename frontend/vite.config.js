import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api/products": "http://localhost:8001",
      "/api/dictionaries": "http://localhost:8001",
      "/api/orders": "http://localhost:8002"
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    globals: true
  }
});
