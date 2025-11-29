<?php
/**
 * ============================================================
 * Configuración del Backend - AsContSystem
 * ============================================================
 * Este archivo contiene todas las configuraciones necesarias
 * para el funcionamiento del backend PHP.
 * 
 * IMPORTANTE: Actualizar las siguientes configuraciones antes
 * de usar en producción:
 * 1. Credenciales de base de datos
 * 2. Claves de reCAPTCHA
 * 3. Email del administrador
 * 4. Configuración SMTP (si se usa)
 * ============================================================
 */

// ============================================================
// CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL
// ============================================================
// IMPORTANTE: Cambiar estas credenciales según tu servidor
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres');
define('DB_PASSWORD', 'asssoftware'); // ⚠️ CAMBIAR EN PRODUCCIÓN

// ============================================================
// CONFIGURACIÓN DE GOOGLE reCAPTCHA v2
// ============================================================
// Obtener claves en: https://www.google.com/recaptcha/admin
// IMPORTANTE: Reemplazar estos placeholders con tus claves reales
define('RECAPTCHA_SITE_KEY', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'); // ⚠️ PLACEHOLDER - Reemplazar con tu clave de sitio
define('RECAPTCHA_SECRET_KEY', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'); // ⚠️ PLACEHOLDER - Reemplazar con tu clave secreta

// ============================================================
// CONFIGURACIÓN DE EMAIL
// ============================================================
// Email donde se recibirán las notificaciones
define('ADMIN_EMAIL_RECIPIENT', 'alejandrodiaz04zr@gmail.com'); // ⚠️ Email temporal

// Configuración de envío de emails
define('MAIL_USE_SMTP', false); // Cambiar a true para usar SMTP
define('MAIL_FROM_EMAIL', 'noreply@ascont.com');
define('MAIL_FROM_NAME', 'AsContSystem');

// Configuración SMTP (solo si MAIL_USE_SMTP = true)
define('SMTP_HOST', 'smtp.gmail.com'); // ⚠️ Cambiar según tu proveedor
define('SMTP_PORT', 587);
define('SMTP_USERNAME', ''); // ⚠️ Tu usuario SMTP
define('SMTP_PASSWORD', ''); // ⚠️ Tu contraseña SMTP
define('SMTP_ENCRYPTION', 'tls'); // tls o ssl

// ============================================================
// CONFIGURACIÓN DE ARCHIVOS
// ============================================================
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('MAX_FILE_SIZE', 2 * 1024 * 1024); // 2 MB
define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx']);

// ============================================================
// CONFIGURACIÓN DE LOGS
// ============================================================
define('LOG_DIR', __DIR__ . '/logs/');
define('MAIL_FALLBACK_LOG', LOG_DIR . 'mail_fallback.log');
define('ERROR_LOG', LOG_DIR . 'error.log');

// ============================================================
// CONFIGURACIÓN DE SESIONES
// ============================================================
define('SESSION_TIMEOUT', 3600); // 1 hora en segundos

// ============================================================
// CONFIGURACIÓN GENERAL
// ============================================================
define('SITE_URL', 'http://localhost'); // ⚠️ Cambiar a la URL de tu sitio
define('TIMEZONE', 'America/Asuncion');

// ============================================================
// INICIALIZACIÓN
// ============================================================

// Establecer zona horaria
date_default_timezone_set(TIMEZONE);

// Crear directorios necesarios si no existen
$directories = [UPLOAD_DIR, LOG_DIR];
foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        if (!mkdir($dir, 0755, true)) {
            error_log("Error: No se pudo crear el directorio $dir");
        }
    }
}

// Configuración de errores
if ($_SERVER['SERVER_NAME'] === 'localhost' || strpos($_SERVER['SERVER_NAME'], '127.0.0.1') !== false) {
    // Modo desarrollo
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    define('DEBUG_MODE', true);
} else {
    // Modo producción
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', ERROR_LOG);
    define('DEBUG_MODE', false);
}

// ============================================================
// FUNCIÓN DE CONEXIÓN A BASE DE DATOS
// ============================================================
/**
 * Establece conexión con PostgreSQL usando PDO
 * @return PDO|null Objeto PDO o null en caso de error
 */
function getDBConnection() {
    static $pdo = null;
    
    if ($pdo !== null) {
        return $pdo;
    }
    
    try {
        $dsn = sprintf(
            "pgsql:host=%s;port=%s;dbname=%s",
            DB_HOST,
            DB_PORT,
            DB_NAME
        );
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
        
        return $pdo;
    } catch (PDOException $e) {
        error_log("Error de conexión a base de datos: " . $e->getMessage());
        
        if (DEBUG_MODE) {
            die("Error de conexión: " . $e->getMessage());
        } else {
            die("Error de conexión a la base de datos. Por favor, contacte al administrador.");
        }
    }
}

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

/**
 * Sanitiza entrada de usuario
 * @param string $data Datos a sanitizar
 * @return string Datos sanitizados
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Valida formato de email
 * @param string $email Email a validar
 * @return bool True si es válido
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Registra mensaje en archivo de log
 * @param string $message Mensaje a registrar
 * @param string $logFile Archivo de log (por defecto ERROR_LOG)
 */
function logMessage($message, $logFile = ERROR_LOG) {
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $message" . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

/**
 * Obtiene IP del cliente
 * @return string Dirección IP
 */
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
    return $ip;
}

/**
 * Obtiene User Agent del cliente
 * @return string User Agent
 */
function getUserAgent() {
    return $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
}

// ============================================================
// VERIFICACIÓN DE EXTENSIONES PHP NECESARIAS
// ============================================================
$requiredExtensions = ['pdo_pgsql', 'pdo'];
$missingExtensions = [];

foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $missingExtensions[] = $ext;
    }
}

if (!empty($missingExtensions)) {
    $message = "Extensiones PHP faltantes: " . implode(', ', $missingExtensions);
    error_log($message);
    
    if (DEBUG_MODE) {
        die($message . ". Por favor, instale las extensiones necesarias.");
    }
}

// ============================================================
// FIN DE CONFIGURACIÓN
// ============================================================
