<?php
// Test básico de configuración del servidor
// Version simplificada para evitar errores

// Configurar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers básicos
header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html><html><head><title>Test</title></head><body>";
echo "<h1>Test de Configuración - AsContSystem</h1>";
echo "<pre>";

// 1. Información PHP básica
echo "\n=== INFORMACIÓN PHP ===\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "\n";
echo "Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown') . "\n";
echo "Script: " . __FILE__ . "\n";
echo "Directory: " . __DIR__ . "\n";

// 2. Verificar archivos
echo "\n=== VERIFICACIÓN DE ARCHIVOS ===\n";
$files_to_check = [
    '../config/config.php',
    '../config/Mailer.php',
    '../config/Database.php',
    '../lib/PHPMailer.php',
    '../lib/SMTP.php',
    '../lib/Exception.php'
];

foreach ($files_to_check as $file) {
    $full_path = __DIR__ . '/' . $file;
    $exists = file_exists($full_path);
    echo "$file: " . ($exists ? "✓ EXISTS" : "✗ NOT FOUND") . "\n";
    if ($exists) {
        echo "  Path: $full_path\n";
        echo "  Readable: " . (is_readable($full_path) ? "YES" : "NO") . "\n";
    }
}

// 3. Verificar directorios
echo "\n=== VERIFICACIÓN DE DIRECTORIOS ===\n";
$dirs_to_check = [
    '../uploads',
    '../uploads/cv'
];

foreach ($dirs_to_check as $dir) {
    $full_path = __DIR__ . '/' . $dir;
    $exists = is_dir($full_path);
    echo "$dir: " . ($exists ? "✓ EXISTS" : "✗ NOT FOUND") . "\n";
    if ($exists) {
        echo "  Path: $full_path\n";
        echo "  Writable: " . (is_writable($full_path) ? "YES" : "NO") . "\n";
        echo "  Permissions: " . substr(sprintf('%o', fileperms($full_path)), -4) . "\n";
    }
}

// 4. Intentar cargar config.php
echo "\n=== CARGA DE CONFIG.PHP ===\n";
$config_path = __DIR__ . '/../config/config.php';
if (file_exists($config_path)) {
    try {
        require_once $config_path;
        echo "✓ Config cargado exitosamente\n";
        
        // Verificar constantes
        $constants = ['DB_HOST', 'DB_NAME', 'DB_USER', 'MAIL_ADMIN', 'SITE_URL'];
        echo "\nConstantes definidas:\n";
        foreach ($constants as $const) {
            if (defined($const)) {
                $value = constant($const);
                // Ocultar contraseñas
                if (strpos($const, 'PASS') !== false) {
                    $value = '***HIDDEN***';
                }
                echo "  $const = $value\n";
            } else {
                echo "  $const = ✗ NO DEFINIDA\n";
            }
        }
    } catch (Exception $e) {
        echo "✗ Error al cargar config: " . $e->getMessage() . "\n";
        echo "  File: " . $e->getFile() . "\n";
        echo "  Line: " . $e->getLine() . "\n";
    }
} else {
    echo "✗ config.php NO EXISTE en: $config_path\n";
    echo "\n¡ACCIÓN REQUERIDA!\n";
    echo "Debes crear el archivo backend/config/config.php con las credenciales del hosting.\n";
}

// 5. Verificar extensiones PHP
echo "\n=== EXTENSIONES PHP ===\n";
$extensions = ['pdo', 'pdo_pgsql', 'curl', 'mbstring', 'openssl'];
foreach ($extensions as $ext) {
    echo "$ext: " . (extension_loaded($ext) ? "✓ LOADED" : "✗ NOT LOADED") . "\n";
}

echo "\n=== FIN DEL TEST ===\n";
echo "</pre>";
echo "</body></html>";
?>

