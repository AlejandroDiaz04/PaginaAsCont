/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Vacío = same-origin / proxy. Ej. http://localhost:8000 si no usás proxy. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
