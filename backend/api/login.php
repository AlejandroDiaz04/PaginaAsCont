<?php
/**
 * API para inicio de sesión
 * Autentica al usuario y crea una sesión PHP
 */

require_once '../config/config.php';
require_once '../config/session.php';
require_once '../config/Database.php';
require_once '../lib/RateLimit.php';

ascont_session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

if (!RateLimit::attempt('login', 10, 900)) {
    RateLimit::rejectJson();
}

$mensajes_publicos = [
    'Email/Usuario y contraseña son obligatorios',
    'Credenciales incorrectas',
    'Tu cuenta aún no ha sido activada. Por favor, espera la confirmación por correo.',
];

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($data === null) {
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    } else {
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';
    }

    if ($email === '' || $password === '') {
        throw new Exception('Email/Usuario y contraseña son obligatorios');
    }

    $db = new Database();

    $sql = "SELECT id, nombre, email, password, activo FROM usuarios WHERE email = ? OR nombre = ?";
    $result = $db->query($sql, [$email, $email]);
    $user = $db->fetch($result);

    if (!$user) {
        throw new Exception('Credenciales incorrectas');
    }

    if ($user['activo'] === false || $user['activo'] === 'f' || $user['activo'] === 0) {
        throw new Exception('Tu cuenta aún no ha sido activada. Por favor, espera la confirmación por correo.');
    }

    if (!password_verify($password, $user['password'])) {
        throw new Exception('Credenciales incorrectas');
    }

    session_regenerate_id(true);

    $_SESSION['authenticated'] = true;
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_nombre'] = (string) $user['nombre'];

    $token_sesion = bin2hex(random_bytes(32));
    $fecha_expiracion = date('Y-m-d H:i:s', time() + SESSION_LIFETIME);

    $sql = "INSERT INTO sesiones (usuario_id, token_sesion, fecha_expiracion) VALUES (?, ?, ?)";
    $db->query($sql, [$user['id'], $token_sesion, $fecha_expiracion]);

    echo json_encode([
        'success' => true,
        'message' => 'Inicio de sesión exitoso',
        'user' => [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'email' => $user['email']
        ],
        'redirect' => SITE_URL . '/'
    ]);

} catch (Exception $e) {
    error_log('Error en login.php');
    $mensaje = in_array($e->getMessage(), $mensajes_publicos, true)
        ? $e->getMessage()
        : 'No se pudo iniciar sesión. Intente nuevamente.';
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $mensaje
    ]);
}
?>
