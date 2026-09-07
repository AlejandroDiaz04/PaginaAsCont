# Frontend AsCont (React + TypeScript)

SPA en producción. El sitio HTML estático de la raíz ya no se usa.

## Desarrollo local

Desde la **raíz del repo** (PHP + assets/images):

```bash
php -S localhost:8000
```

En otra terminal, desde `frontend/`:

```bash
npm install
npm run dev
```

Vite proxifica `/backend` y `/assets` a `http://localhost:8000`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build a `dist/` |
| `npm run preview` | Preview del build |

## Rutas SPA

Definidas en `src/config/routes.ts`.

## Animaciones

Reveals al scroll: **AOS** (`data-aos`). No hay CSS/JS de animación legacy en el bundle React.

## Deploy (cutover)

1. `cd frontend && npm run build`
2. Publicar el contenido de `frontend/dist/` en el **document root**
3. Conservar en el servidor: `/backend`, `/assets/images` (y el `.htaccess` de la raíz del repo o copiar `deploy.htaccess` como `.htaccess` del document root)
4. Las URLs `/HTML/*.html` redirigen 301 a las rutas SPA

El gate PHP `contenido_exclusivo.php` solo redirige a `/login` o `/contenido-exclusivo` (ya no sirve HTML).
