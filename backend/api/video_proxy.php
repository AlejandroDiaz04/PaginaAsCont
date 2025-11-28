<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../config/config.php';

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['token'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'No autorizado'
    ]);
    exit;
}

// Obtener el ID del video solicitado
$videoId = $_GET['id'] ?? '';

if (empty($videoId)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'ID de video no proporcionado'
    ]);
    exit;
}

// Mapeo de IDs seguros a URLs reales de YouTube (videos no listados)
// IMPORTANTE: Cambia estos IDs por tus videos reales
$videoMap = [
    // Videos de tutoriales
    'tutorial_contabilidad' => 'https://www.youtube.com/embed/videoseries?si=zK-ckLaxoeuS2uKm&amp;list=PLUouKNeLdNGfOuqlEUP9PNh04aaX114Lb',
    'tutorial_transacciones' => 'https://www.youtube.com/embed/videoseries?si=oyn7KLw39io-JbOd&amp;list=PLUouKNeLdNGdTFwkYEyNTO96vyuzfbcdN',
    'tutorial_configuraciones' => 'https://www.youtube.com/embed/videoseries?si=VnLj19eFHXovLeHj&amp;list=PLUouKNeLdNGezM6tzC3ulF4PYGB7msd6N'
];

// Verificar si el ID existe en el mapeo
if (!isset($videoMap[$videoId])) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Video no encontrado'
    ]);
    exit;
}

// Devolver la URL del video
echo json_encode([
    'success' => true,
    'url' => $videoMap[$videoId]
]);
?>
