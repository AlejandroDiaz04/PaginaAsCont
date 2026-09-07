# Fase 0 — Preparación React (`frontend/`)

Preparación para migrar el sitio AsCont a React + TypeScript sin tocar el HTML/PHP actual.

## Decisiones fijas

| Tema | Decisión |
|------|----------|
| Ubicación de la app | Carpeta `frontend/` (coexiste con el sitio estático) |
| Reveal al scroll | **AOS** (`aos` + `@types/aos`) |
| Framer Motion | Fuera de Fase 0; solo si hace falta en loader/hero/login más adelante |
| API en local | Proxy Vite → `http://localhost:8000` (rutas `/backend/*`) |
| API en producción | `VITE_API_URL` vacío = same-origin con PHP |

## Mapa HTML actual → rutas SPA

| HTML actual | Ruta SPA (`ROUTES`) |
|-------------|---------------------|
| `index.html` | `/` |
| `HTML/sistema.html` | `/sistema` |
| `HTML/aplicacion.html` | `/aplicacion` |
| `HTML/empresa.html` | `/empresa` |
| `HTML/login.html` | `/login` |
| `HTML/demo.html` | `/demo` |
| `HTML/contenido_exclusivo.html` | `/contenido-exclusivo` |
| `HTML/politica-de-privacidad.html` | `/privacidad` |

Constantes tipadas: [`src/config/routes.ts`](src/config/routes.ts).

## Endpoints PHP (cliente futuro)

| Clave TS | Path |
|----------|------|
| `checkSession` | `/backend/api/check_session.php` |
| `login` | `/backend/api/login.php` |
| `logout` | `/backend/api/logout.php` |
| `registro` | `/backend/api/registro.php` |
| `activarCuenta` | `/backend/api/activar_cuenta.php` |
| `solicitudDemo` | `/backend/api/solicitud_demo.php` |
| `trabajaConNosotros` | `/backend/api/trabaja_con_nosotros.php` |
| `contenidoExclusivo` | `/backend/api/contenido_exclusivo.php` |
| `videoPresentacion` | `/backend/api/video_presentacion.php` |
| `videoProxy` | `/backend/api/video_proxy.php` |

Constantes tipadas: [`src/config/endpoints.ts`](src/config/endpoints.ts).  
Base URL: [`src/config/apiBase.ts`](src/config/apiBase.ts) (`import.meta.env.VITE_API_URL`).

Auth: los `fetch` deben usar `credentials: "include"` (cookie de sesión PHP).

## AOS — qué reemplaza

Stub previsto: [`src/lib/aos.ts`](src/lib/aos.ts) → `initAos()` en `main.tsx` (Fase 1).

Animaciones / mecanismos actuales a retirar cuando se migre cada página:

- Clase `.animate-on-scroll` + `IntersectionObserver` en `assets/js/scrips.js`, `assets/js/pages/empresa.js`, `assets/js/components.js`
- Hojas `assets/css/animaciones.css`, `assets/css/pages/animaciones-html.css`, `assets/css/pages/animaciones-empresa.css`
- Keyframes de entrada: `fadeInUp`, `slideInLeft`, `slideInRight`, `slideInUp`, `slideInDown`, `bounceInSubtle`, `scaleIn` (reveals de secciones)

Equivalentes AOS típicos: `fade-up`, `fade-left`, `fade-right`, `fade-down` (+ `data-aos-delay` / `data-aos-duration`).

**No cubre AOS** (siguen en fases posteriores): PageLoader (cortinas), hero slides + progress, typewriter, carrusel clientes, panel login, modal/lightbox.

## Contrato env y proxy

1. Copiar [`.env.example`](.env.example) → `.env` (local).
2. En Fase 1, copiar [`vite.config.example.ts`](vite.config.example.ts) → `vite.config.ts`.
3. Levantar PHP en `http://localhost:8000` y Vite en su puerto; las peticiones a `/backend` se proxifican.

```env
# Vacío = same-origin / proxy. No hardcodear localhost en prod.
VITE_API_URL=
```

## Fuera de alcance (Fase 0)

- Scaffold Vite/React completo y `npm install`
- Migración de páginas o componentes UI
- Cambios a PHP, `.htaccess` de producción o HTML actual
- PageLoader / Navbar / Router (Fase 1)

## Siguiente paso (Fase 1)

1. `npm create vite@latest` (React + TS) dentro de `frontend/` o fusionar scaffold conservando `src/config/` y `src/lib/aos.ts`.
2. Instalar `aos` y `@types/aos`; llamar `initAos()` desde `main.tsx`.
3. Usar `ROUTES` / `API_ENDPOINTS` / `apiUrl()` en el router y los services.
