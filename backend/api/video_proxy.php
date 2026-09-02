<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/session.php';

ascont_session_start();

header('Content-Type: application/json; charset=utf-8');

if (!ascont_is_authenticated()) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'No autorizado'
    ]);
    exit;
}

$videoMap = [
    'tutorial_contabilidad' => 'https://www.youtube.com/embed/videoseries?si=zK-ckLaxoeuS2uKm&list=PLUouKNeLdNGfOuqlEUP9PNh04aaX114Lb',
    'tutorial_transacciones' => 'https://www.youtube.com/embed/videoseries?si=oyn7KLw39io-JbOd&list=PLUouKNeLdNGdTFwkYEyNTO96vyuzfbcdN',
    'tutorial_configuraciones' => 'https://www.youtube.com/embed/videoseries?si=VnLj19eFHXovLeHj&list=PLUouKNeLdNGezM6tzC3ulF4PYGB7msd6N'
];

$videoId = isset($_GET['id']) ? trim((string) $_GET['id']) : '';

if ($videoId === '') {
    echo json_encode([
        'success' => true,
        'videos' => $videoMap
    ]);
    exit;
}

if (!isset($videoMap[$videoId])) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Video no encontrado'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'url' => $videoMap[$videoId]
]);
?>
