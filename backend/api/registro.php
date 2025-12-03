<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// === LOG PERSONALIZADO ===
function debug_log($msg) {
    file_put_contents(__DIR__.'/registro_debug.log', date('c')." - $msg\n", FILE_APPEND);
}

debug_log("== Nuevo intento de registro ==");
debug_log("PHP version: ".phpversion());

/**
 * API para registro de usuarios
 * Crea usuario inactivo y envía correo al administrador con link de activación
 */

// Cabeceras CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    debug_log("Método no permitido: ".$_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

debug_log("Require config...");
require_once '../config/config.php';
debug_log("Require Database...");
require_once '../config/Database.php';
debug_log("Require Mailer...");
require_once '../config/Mailer.php';

try {
    // Obtener datos del formulario
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    debug_log("Datos recibidos: ".print_r($data, true));
    debug_log("Input raw: " . $input);

    // Si no hay JSON o está vacío, intentar con POST normal
    if ($data === null || empty($data)) {
        $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    } else {
        $nombre = isset($data['nombre']) ? trim($data['nombre']) : '';
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';
    }

    debug_log("Valores: nombre=[$nombre], email=[$email], pass-len=".strlen($password)."]");

    // Validar campos requeridos
    if (empty($nombre) || empty($email) || empty($password)) {
        debug_log("Campos obligatorios vacíos");
        throw new Exception('Todos los campos son obligatorios');
    }

    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        debug_log("Email inválido: $email");
        throw new Exception('Email inválido');
    }

    // Validar longitud de contraseña
    if (strlen($password) < 6) {
        debug_log("Password corta");
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }

    // Conectar a la base de datos
    debug_log("CONEXIÓN DB...");
    $db = new Database();
    debug_log("Conectado.");

    // Verificar si el email ya existe
    $sql = "SELECT id FROM usuarios WHERE email = ?";
    debug_log("Consulta si usuario existe...");
    $result = $db->query($sql, [$email]);
    if ($db->fetch($result)) {
        debug_log("El email ya existe");
        throw new Exception('Este email ya está registrado');
    }

    // Hash de la contraseña
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insertar usuario (inactivo por defecto)
    $sql = "INSERT INTO usuarios (nombre, email, password, activo) VALUES (?, ?, ?, false) RETURNING id";
    debug_log("Insertando usuario...");
    $result = $db->query($sql, [$nombre, $email, $password_hash]);

    $user = $db->fetch($result);
    if (!$user) {
        debug_log("Error insertando usuario");
        throw new Exception('Error al crear el usuario');
    }

    $user_id = $user['id'];

    // Generar token de activación
    $token = bin2hex(random_bytes(32));
    $fecha_expiracion = date('Y-m-d H:i:s', time() + TOKEN_EXPIRATION);

    // Guardar token en la base de datos
    $sql = "INSERT INTO tokens_activacion (usuario_id, token, fecha_expiracion) VALUES (?, ?, ?)";
    debug_log("Insertando token...");
    $result = $db->query($sql, [$user_id, $token, $fecha_expiracion]);

    if (!$result) {
        debug_log("Error insertando token");
        throw new Exception('Error al generar el token de activación');
    }

    debug_log("Enviando correos...");
    $emailEnviado = false;
    try {
        // 1. Enviar al ADMIN con el link de activación
        Mailer::send(
            MAIL_ADMIN,
            "Nueva Solicitud de Acceso - AsCont System",
            Mailer::templateActivacionAdmin($nombre, $email, $token)
        );

        // 2. Enviar al USUARIO confirmando que se recibió su solicitud
        Mailer::send(
            $email,
            "Solicitud Recibida - AsCont System",
            Mailer::templateSolicitudRecibida($nombre)
        );

        $emailEnviado = true;
        debug_log("Correos enviados OK");
    } catch (Exception $e) {
        debug_log("Error enviando correos: ".$e->getMessage());
        $emailEnviado = false;
    }
    if (!$emailEnviado) {
    echo "Fallo el envío del correo (verifica logs de error para detalles)";
}

    // Respuesta exitosa
    debug_log("Fin OK");
    echo json_encode([
        'success' => true,
        'message' => 'Tu solicitud de registro ha sido enviada correctamente. ' .
            ($emailEnviado ? 'Recibirás un correo de confirmación cuando tu cuenta sea activada.' :
                'Un administrador activará tu cuenta pronto.')
    ]);
} catch (Exception $e) {
    debug_log("EXCEPCIÓN CATCH: ".$e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>