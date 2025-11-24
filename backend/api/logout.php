<?php
/**
 * API para cerrar sesión
 */

// Iniciar sesión
session_start();

// Cabeceras CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

require_once '../config/config.php';
require_once '../config/Database.php';

try {
    // Marcar sesiones como inactivas en la base de datos si existe user_id
    if (isset($_SESSION['user_id'])) {
        $db = new Database();
        $sql = "UPDATE sesiones SET activo = false WHERE usuario_id = ? AND activo = true";
        $db->query($sql, [$_SESSION['user_id']]);
    }
    
    // Destruir todas las variables de sesión
    $_SESSION = array();
    
    // Destruir la cookie de sesión
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time()-42000, '/');
    }
    
    // Destruir la sesión
    session_destroy();
    
    echo json_encode([
        'success' => true,
        'message' => 'Sesión cerrada exitosamente',
        'redirect' => SITE_URL . '/HTML/login.html'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
