<?php
/**
 * Archivo de configuración del sistema
 * Contiene parámetros de conexión a base de datos y correo electrónico
 */

// Configuración de la base de datos PostgreSQL
// define('DB_HOST', 'localhost');
// define('DB_PORT', '5432');
// define('DB_NAME', 'pagina_web');
// define('DB_USER', 'postgres');
// define('DB_PASS', 'assoftware');
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'ascont_pagina_web');
define('DB_USER', 'ascont');
define('DB_PASS', 'AlexisZaracho341');

// Para cPanel usa mail.tudominio.com o smtp.tudominio.com
define('MAIL_HOST', 'mail.ascont.com.py'); // Cambia según tu hosting

define('MAIL_PORT', 465);
define('MAIL_ENCRYPTION', 'ssl');

// Alternativa si 465 no funciona:
//define('MAIL_PORT', 587);
//define('MAIL_ENCRYPTION', 'tls');

// Email y contraseña de la cuenta de tu hosting
define('MAIL_USERNAME', 'administradorweb@ascont.com.py');
define('MAIL_PASSWORD', 'Netbeans802');
define('MAIL_FROM', 'administradorweb@ascont.com.py');
define('MAIL_FROM_NAME', 'AsContSystem');

// Correo admin donde se recibirán las notificaciones
define('MAIL_ADMIN', 'alejandrodiaz04zr@gmail.com'); 

// Configuración del sitio
define('SITE_URL', 'https://ascont.com.py'); // URL base de tu sitio
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
