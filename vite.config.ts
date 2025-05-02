import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode, command}) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: command === "serve" ? "/" : env.VITE_BASE_PATH || "/cel-vis/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
  };
});
