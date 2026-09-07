/**
 * Plantilla para Fase 1.
 * Copiar a vite.config.ts al crear el scaffold Vite + React + TS.
 *
 * Requiere: npm i -D vite @vitejs/plugin-react
 * PHP local: php -S localhost:8000 (desde la raíz del repo PaginaAsCont)
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/backend": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
