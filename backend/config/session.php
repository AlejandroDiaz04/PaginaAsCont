<?php
/**
 * Configuración e inicio de sesión PHP.
 * Las cookies se definen ANTES de session_start().
 */

if (!defined('SESSION_LIFETIME')) {
    require_once __DIR__ . '/config.php';
}

function ascont_is_https()
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }
    if (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443) {
        return true;
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') {
        return true;
    }
    return false;
}

function ascont_session_start()
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $lifetime = defined('SESSION_LIFETIME') ? (int) SESSION_LIFETIME : 86400;
    $secure = ascont_is_https();

    session_set_cookie_params([
        'lifetime' => $lifetime,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function ascont_is_authenticated()
{
    return isset($_SESSION['authenticated'], $_SESSION['user_id'])
        && $_SESSION['authenticated'] === true
        && (int) $_SESSION['user_id'] > 0;
}

function ascont_destroy_session()
{
    $_SESSION = [];

    if (session_status() === PHP_SESSION_ACTIVE) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $params['path'] !== '' ? $params['path'] : '/',
            'domain' => $params['domain'] ?? '',
            'secure' => !empty($params['secure']),
            'httponly' => !empty($params['httponly']),
            'samesite' => $params['samesite'] ?? 'Lax',
        ]);
        session_destroy();
    }
}
