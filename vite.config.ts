import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: [
      "class-variance-authority",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-slot", 
      "@radix-ui/react-popover"
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-dropdown-menu"],
    },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
