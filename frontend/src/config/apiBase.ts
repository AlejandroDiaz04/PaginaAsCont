/**
 * Base URL de la API.
 * - Producción / local con proxy: VITE_API_URL vacío → rutas relativas (/backend/...).
 * - Alternativa local sin proxy: VITE_API_URL=http://localhost:8000
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (typeof raw !== "string" || raw.trim() === "") {
    return "";
  }
  return raw.replace(/\/$/, "");
}

/** Une base + path de endpoint (path debe empezar con /). */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  if (!path.startsWith("/")) {
    return `${base}/${path}`;
  }
  return `${base}${path}`;
}
