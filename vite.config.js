import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: {
      "/games": "http://localhost:5000",
      "/api": "http://localhost:5000",
    },
  },
  // esbuild: { loader: "jsx", include: /src\/.*\.js$/ },
  // optimizeDeps: {
  //   esbuildOptions: { loader: { ".js": "jsx" } },
  // },
});
