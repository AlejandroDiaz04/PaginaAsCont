<?php
/**
 * ============================================================
 * Logout del Panel de Administración
 * AsContSystem - logout.php
 * ============================================================
 * Cierra la sesión del administrador y redirige al login.
 * ============================================================
 */

// Iniciar sesión
session_start();

// Destruir todas las variables de sesión
$_SESSION = array();

// Si se desea destruir la sesión completamente, también se debe borrar la cookie de sesión
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 42000, '/');
}

// Finalmente, destruir la sesión
session_destroy();

// Redirigir al login
header('Location: admin_login.php');
exit;
