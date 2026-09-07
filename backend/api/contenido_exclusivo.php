<?php
/**
 * Gate legacy de contenido exclusivo.
 * Tras el cutover SPA ya no sirve HTML: redirige a rutas React.
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/session.php';

ascont_session_start();

if (!ascont_is_authenticated()) {
    $login = '/login?redirect=' . rawurlencode('/contenido-exclusivo');
    header('Location: ' . $login, true, 302);
    exit;
}

header('Location: /contenido-exclusivo', true, 302);
exit;
?>
