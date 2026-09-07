/**
 * Endpoints PHP actuales consumidos por el front.
 * Usar con apiUrl() y fetch(..., { credentials: "include" }) para auth.
 */
export const API_ENDPOINTS = {
  checkSession: "/backend/api/check_session.php",
  login: "/backend/api/login.php",
  logout: "/backend/api/logout.php",
  registro: "/backend/api/registro.php",
  activarCuenta: "/backend/api/activar_cuenta.php",
  solicitudDemo: "/backend/api/solicitud_demo.php",
  trabajaConNosotros: "/backend/api/trabaja_con_nosotros.php",
  contenidoExclusivo: "/backend/api/contenido_exclusivo.php",
  videoPresentacion: "/backend/api/video_presentacion.php",
  videoProxy: "/backend/api/video_proxy.php",
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
