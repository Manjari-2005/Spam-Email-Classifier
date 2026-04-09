import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Vite 8 uses Oxc for faster JSX transforms
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Forces it to 5173 or fails (better for CORS)
    proxy: {
      // Modern proxy syntax for Vite 8
      "/classify": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/metrics": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
  // We use rolldownOptions instead of rollupOptions in Vite 8
  build: {
    rolldownOptions: {
      output: {
        manualChunks: undefined, // Let Rolldown handle optimization
      },
    },
  },
});