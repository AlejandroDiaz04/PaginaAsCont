/**
 * Rutas SPA futuras (Fase 1+).
 * Mapeo HTML → SPA: ver frontend/MIGRACION_FASE0.md
 */
export const ROUTES = {
  home: "/",
  sistema: "/sistema",
  aplicacion: "/aplicacion",
  empresa: "/empresa",
  login: "/login",
  demo: "/demo",
  contenidoExclusivo: "/contenido-exclusivo",
  privacidad: "/privacidad",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
