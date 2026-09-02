<?php
/**
 * API para verificar si el usuario tiene una sesión PHP activa.
 * No consulta la tabla sesiones.
 */

require_once '../config/config.php';
require_once '../config/session.php';

ascont_session_start();

header('Content-Type: application/json; charset=utf-8');

if (ascont_is_authenticated()) {
    echo json_encode([
        'authenticated' => true,
        'user' => [
            'id' => (int) $_SESSION['user_id'],
            'nombre' => (string) $_SESSION['user_nombre']
        ]
    ]);
} else {
    echo json_encode([
        'authenticated' => false
    ]);
}
?>
