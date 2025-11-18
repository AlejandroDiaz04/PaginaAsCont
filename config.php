<?php
/**
 * config.php
 * Configuración central del backend PHP para formularios
 * 
 * IMPORTANTE: Este archivo contiene configuraciones sensibles.
 * Asegúrese de actualizar los valores antes de desplegar en producción.
 */

// ============================================
// CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL
// ============================================
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');
define('DB_USER', 'postgres');
define('DB_PASSWORD', 'asssoftware');

// ============================================
// GOOGLE reCAPTCHA v2 CONFIGURATION
// ============================================
// Genere sus claves en: https://www.google.com/recaptcha/admin
define('RECAPTCHA_SITE_KEY', 'YOUR_RECAPTCHA_SITE_KEY_HERE');
define('RECAPTCHA_SECRET_KEY', 'YOUR_RECAPTCHA_SECRET_KEY_HERE');

// ============================================
// CONFIGURACIÓN DE EMAIL
// ============================================
// Email temporal del administrador (cambiar a gerencia@ascont.com o admin@ascont.com en producción)
define('ADMIN_EMAIL_RECIPIENT', 'alejandrodiaz04zr@gmail.com');
define('ADMIN_EMAIL_FROM', 'noreply@ascont.com');
define('ADMIN_EMAIL_FROM_NAME', 'AsCont Systems');

// ============================================
// CONFIGURACIÓN DE UPLOADS
// ============================================
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('MAX_FILE_SIZE', 2097152); // 2MB en bytes
define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx']);

// ============================================
// CONFIGURACIÓN DE LOGS
// ============================================
define('LOG_DIR', __DIR__ . '/logs/');

// ============================================
// CONFIGURACIÓN DE SESIONES
// ============================================
define('SESSION_TIMEOUT', 3600); // 1 hora en segundos

// ============================================
// CREAR DIRECTORIOS SI NO EXISTEN
// ============================================
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

if (!file_exists(LOG_DIR)) {
    mkdir(LOG_DIR, 0755, true);
}

// ============================================
// FUNCIÓN DE CONEXIÓN A BASE DE DATOS
// ============================================
function getDBConnection() {
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
        throw new Exception("Error de conexión a la base de datos. Por favor, intente más tarde.");
    }
}

// ============================================
// FUNCIÓN DE VALIDACIÓN DE reCAPTCHA
// ============================================
function verifyRecaptcha($recaptchaResponse) {
    if (empty($recaptchaResponse)) {
        return false;
    }
    
    $secretKey = RECAPTCHA_SECRET_KEY;
    $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    
    $data = [
        'secret' => $secretKey,
        'response' => $recaptchaResponse,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];
    
    $options = [
        'http' => [
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = @file_get_contents($verifyUrl, false, $context);
    
    if ($result === false) {
        error_log("Error al verificar reCAPTCHA: No se pudo conectar con Google");
        return false;
    }
    
    $resultJson = json_decode($result, true);
    
    return isset($resultJson['success']) && $resultJson['success'] === true;
}

// ============================================
// FUNCIÓN DE SANITIZACIÓN DE INPUTS
// ============================================
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// ============================================
// FUNCIÓN DE VALIDACIÓN DE EMAIL
// ============================================
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ============================================
// FUNCIÓN DE LOG
// ============================================
function logMessage($message, $filename = 'app.log') {
    $logFile = LOG_DIR . $filename;
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] {$message}\n";
    error_log($logEntry, 3, $logFile);
}

// ============================================
// CONFIGURACIÓN DE ZONA HORARIA
// ============================================
date_default_timezone_set('America/Asuncion');

// ============================================
// INICIO DE SESIÓN (solo si no está iniciada)
// ============================================
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
