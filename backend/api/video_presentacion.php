<?php
session_start();

require_once __DIR__ . '/../config/config.php';

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['token'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'No autorizado'
    ]);
    exit;
}

// Ruta al video de presentación
$videoPath = __DIR__ . '/../../IMG/presentacion1.mp4';

if (!file_exists($videoPath)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Video no encontrado'
    ]);
    exit;
}

// Obtener información del archivo
$fileSize = filesize($videoPath);
$fileMime = 'video/mp4';

// Soporte para streaming (range requests)
$start = 0;
$end = $fileSize - 1;

if (isset($_SERVER['HTTP_RANGE'])) {
    $range = $_SERVER['HTTP_RANGE'];
    $range = str_replace('bytes=', '', $range);
    $range = explode('-', $range);
    
    $start = intval($range[0]);
    if (isset($range[1]) && $range[1] !== '') {
        $end = intval($range[1]);
    }
    
    header('HTTP/1.1 206 Partial Content');
    header('Content-Range: bytes ' . $start . '-' . $end . '/' . $fileSize);
} else {
    header('HTTP/1.1 200 OK');
}

// Headers para el video
header('Content-Type: ' . $fileMime);
header('Content-Length: ' . ($end - $start + 1));
header('Accept-Ranges: bytes');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Prevenir descarga directa
header('Content-Disposition: inline; filename="video.mp4"');

// Enviar el contenido del video
$file = fopen($videoPath, 'rb');
fseek($file, $start);

$bufferSize = 8192;
$bytesRemaining = $end - $start + 1;

while ($bytesRemaining > 0 && !feof($file)) {
    $bytesToRead = min($bufferSize, $bytesRemaining);
    echo fread($file, $bytesToRead);
    $bytesRemaining -= $bytesToRead;
    flush();
}

fclose($file);
exit;
?>
