<?php
/**
 * Gate de contenido exclusivo (Opción A).
 *
 * Apache reescribe internamente:
 *   /HTML/contenido_exclusivo.html  ->  /backend/api/contenido_exclusivo.php
 *
 * La URL pública NO cambia. El archivo HTML permanece en disco y no se duplica.
 * Sin sesión PHP válida se redirige a /HTML/login.html.
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/session.php';

ascont_session_start();

if (!ascont_is_authenticated()) {
    $login = '/HTML/login.html?redirect=' . rawurlencode('/HTML/contenido_exclusivo.html');
    header('Location: ' . $login, true, 302);
    exit;
}

$htmlPath = realpath(__DIR__ . '/../../HTML/contenido_exclusivo.html');
$htmlDir = realpath(__DIR__ . '/../../HTML');

if ($htmlPath === false || $htmlDir === false || strpos($htmlPath, $htmlDir) !== 0 || !is_readable($htmlPath)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Contenido no disponible.';
    exit;
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
readfile($htmlPath);
exit;
?>
