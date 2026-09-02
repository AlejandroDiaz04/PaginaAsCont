<?php
/**
 * Ejemplo de configuración del sistema.
 * Copiar este archivo como config.php y completar con valores reales.
 * NO versionar config.php (está en .gitignore).
 */

// Base de datos PostgreSQL
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'nombre_base_de_datos');
define('DB_USER', 'usuario_db');
define('DB_PASS', 'cambiar_esta_contraseña');

// Correo
define('MAIL_HOST', 'localhost');
define('MAIL_PORT', 587);
define('MAIL_ENCRYPTION', 'tls');
define('MAIL_USERNAME', 'correo@tudominio.com');
define('MAIL_PASSWORD', 'cambiar_esta_contraseña');
define('MAIL_FROM', 'correo@tudominio.com');
define('MAIL_FROM_NAME', 'AsContSystem');
define('MAIL_ADMIN', 'admin@tudominio.com');

// Sitio
define('SITE_URL', 'https://tudominio.com');
define('SITE_NAME', 'AsContSystem');

// Sesiones y tokens
define('SESSION_LIFETIME', 3600 * 24);
define('TOKEN_EXPIRATION', 3600 * 48);

date_default_timezone_set('America/Asuncion');

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
?>
