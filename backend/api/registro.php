<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

function debug_log($msg) {
    file_put_contents(__DIR__.'/registro_debug.log', date('c')." - $msg\n", FILE_APPEND);
}

debug_log("== Nuevo intento de registro ==");

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    debug_log("Método no permitido");
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

require_once '../config/config.php';
require_once '../config/Database.php';
require_once '../config/Mailer.php';

$mensajes_publicos = [
    'Todos los campos son obligatorios',
    'Email inválido',
    'La contraseña debe tener al menos 6 caracteres',
    'Este email ya está registrado',
];

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data === null || empty($data)) {
        $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    } else {
        $nombre = isset($data['nombre']) ? trim($data['nombre']) : '';
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';
    }

    if ($nombre === '' || $email === '' || $password === '') {
        throw new Exception('Todos los campos son obligatorios');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }

    if (strlen($password) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }

    $db = new Database();

    $sql = "SELECT id FROM usuarios WHERE email = ?";
    $result = $db->query($sql, [$email]);
    if ($db->fetch($result)) {
        throw new Exception('Este email ya está registrado');
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nombre, email, password, activo) VALUES (?, ?, ?, false) RETURNING id";
    $result = $db->query($sql, [$nombre, $email, $password_hash]);

    $user = $db->fetch($result);
    if (!$user) {
        throw new Exception('Error al crear el usuario');
    }

    $user_id = $user['id'];

    $token = bin2hex(random_bytes(32));
    $fecha_expiracion = date('Y-m-d H:i:s', time() + TOKEN_EXPIRATION);

    $sql = "INSERT INTO tokens_activacion (usuario_id, token, fecha_expiracion) VALUES (?, ?, ?)";
    $result = $db->query($sql, [$user_id, $token, $fecha_expiracion]);

    if (!$result) {
        throw new Exception('Error al generar el token de activación');
    }

    $emailEnviado = false;
    try {
        Mailer::send(
            MAIL_ADMIN,
            "Nueva Solicitud de Acceso - AsCont System",
            Mailer::templateActivacionAdmin($nombre, $email, $token)
        );

        Mailer::send(
            $email,
            "Solicitud Recibida - AsCont System",
            Mailer::templateSolicitudRecibida($nombre)
        );

        $emailEnviado = true;
        debug_log("Correos enviados OK");
    } catch (Exception $e) {
        debug_log("Error enviando correos");
        error_log('Error enviando correos de registro');
        $emailEnviado = false;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Tu solicitud de registro ha sido enviada correctamente. ' .
            ($emailEnviado ? 'Recibirás un correo de confirmación cuando tu cuenta sea activada.' :
                'Un administrador activará tu cuenta pronto.')
    ]);
} catch (Exception $e) {
    debug_log("Error en registro");
    error_log('Error en registro.php');
    $mensaje = in_array($e->getMessage(), $mensajes_publicos, true)
        ? $e->getMessage()
        : 'No se pudo completar el registro. Intente nuevamente.';
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $mensaje
    ]);
}
?>
