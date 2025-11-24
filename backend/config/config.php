<?php
/**
 * Archivo de configuración del sistema
 * Contiene parámetros de conexión a base de datos y correo electrónico
 */

// Configuración de la base de datos PostgreSQL
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'pagina_web');
define('DB_USER', 'postgres');
define('DB_PASS', 'assoftware');

// Configuración de correo electrónico
// IMPORTANTE: Configura estos valores con tu información de correo
define('MAIL_HOST', 'smtp.gmail.com'); // Cambia según tu proveedor (Gmail, Outlook, etc.)
define('MAIL_PORT', 587); // 587 para TLS, 465 para SSL
define('MAIL_USERNAME', 'alejandrodiaz04zr@gmail.com'); // Tu correo electrónico
define('MAIL_PASSWORD', 'lzdl pdor kdsd gxhp'); // Contraseña de aplicación de Gmail
define('MAIL_FROM', 'alejandrodiaz04zr@gmail.com'); // Correo remitente
define('MAIL_FROM_NAME', 'AsContSystem');
define('MAIL_ENCRYPTION', 'tls'); // 'tls' o 'ssl'

// Correo para recibir notificaciones (trabaja con nosotros, solicitudes de demo)
define('MAIL_ADMIN', 'alejandrodiaz04zr@gmail.com'); // Correo donde recibirás todas las solicitudes

// Configuración del sitio
define('SITE_URL', 'http://localhost'); // URL base de tu sitio
define('SITE_NAME', 'AsContSystem');

// Configuración de sesiones
define('SESSION_LIFETIME', 3600 * 24); // 24 horas en segundos

// Configuración de tokens
define('TOKEN_EXPIRATION', 3600 * 48); // 48 horas para activación de cuenta

// Zona horaria
date_default_timezone_set('America/Asuncion');

// Habilitar errores en desarrollo (desactivar en producción)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Codificación
header('Content-Type: text/html; charset=utf-8');
?>
