<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/session.php';

ascont_session_start();

if (!ascont_is_authenticated()) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'No autorizado'
    ]);
    exit;
}

$videoPath = realpath(__DIR__ . '/../../assets/images/presentacion1.mp4');
$expectedDir = realpath(__DIR__ . '/../../assets/images');

if ($videoPath === false || $expectedDir === false || strpos($videoPath, $expectedDir) !== 0 || !is_file($videoPath)) {
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Video no encontrado'
    ]);
    exit;
}

$fileSize = filesize($videoPath);
$start = 0;
$end = $fileSize - 1;

if (isset($_SERVER['HTTP_RANGE']) && preg_match('/bytes=(\d*)-(\d*)/', $_SERVER['HTTP_RANGE'], $matches)) {
    if ($matches[1] !== '') {
        $start = (int) $matches[1];
    }
    if ($matches[2] !== '') {
        $end = (int) $matches[2];
    }

    if ($start > $end || $start >= $fileSize) {
        header('HTTP/1.1 416 Range Not Satisfiable');
        header('Content-Range: bytes */' . $fileSize);
        exit;
    }

    if ($end >= $fileSize) {
        $end = $fileSize - 1;
    }

    header('HTTP/1.1 206 Partial Content');
    header('Content-Range: bytes ' . $start . '-' . $end . '/' . $fileSize);
} else {
    header('HTTP/1.1 200 OK');
}

header('Content-Type: video/mp4');
header('Content-Length: ' . ($end - $start + 1));
header('Accept-Ranges: bytes');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Disposition: inline; filename="video.mp4"');

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
