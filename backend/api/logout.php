<?php
/**
 * API para cerrar sesión
 */

require_once '../config/config.php';
require_once '../config/session.php';
require_once '../config/Database.php';

ascont_session_start();

header('Content-Type: application/json; charset=utf-8');

try {
    if (isset($_SESSION['user_id'])) {
        $db = new Database();
        $sql = "UPDATE sesiones SET activo = false WHERE usuario_id = ? AND activo = true";
        $db->query($sql, [$_SESSION['user_id']]);
    }

    ascont_destroy_session();

    echo json_encode([
        'success' => true,
        'message' => 'Sesión cerrada exitosamente',
        'redirect' => SITE_URL . '/HTML/login.html'
    ]);

} catch (Exception $e) {
    error_log('Error en logout.php');
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo cerrar la sesión. Intente nuevamente.'
    ]);
}
?>
