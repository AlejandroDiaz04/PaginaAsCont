<?php
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
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

require_once '../config/config.php';
require_once '../config/Database.php';
require_once '../config/Mailer.php';

try {
    // Obtener datos del formulario
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Debug: registrar lo que llega
    error_log("Datos recibidos: " . print_r($data, true));
    error_log("Input raw: " . $input);
    
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
    
    // Debug: registrar valores extraídos
    error_log("Nombre: $nombre, Email: $email, Password length: " . strlen($password));
    
    // Validar campos requeridos
    if (empty($nombre) || empty($email) || empty($password)) {
        throw new Exception('Todos los campos son obligatorios');
    }
    
    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // Validar longitud de contraseña
    if (strlen($password) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }
    
    // Conectar a la base de datos
    $db = new Database();
    
    // Verificar si el email ya existe
    $sql = "SELECT id FROM usuarios WHERE email = ?";
    $result = $db->query($sql, [$email]);
    
    if ($db->fetch($result)) {
        throw new Exception('Este email ya está registrado');
    }
    
    // Hash de la contraseña
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar usuario (inactivo por defecto) - usar false para boolean
    $sql = "INSERT INTO usuarios (nombre, email, password, activo) VALUES (?, ?, ?, false) RETURNING id";
    $result = $db->query($sql, [$nombre, $email, $password_hash]);
    
    $user = $db->fetch($result);
    if (!$user) {
        throw new Exception('Error al crear el usuario');
    }
    
    $user_id = $user['id'];
    
    // Generar token de activación
    $token = bin2hex(random_bytes(32));
    $fecha_expiracion = date('Y-m-d H:i:s', time() + TOKEN_EXPIRATION);
    
    // Guardar token en la base de datos
    $sql = "INSERT INTO tokens_activacion (usuario_id, token, fecha_expiracion) VALUES (?, ?, ?)";
    $result = $db->query($sql, [$user_id, $token, $fecha_expiracion]);
    
    if (!$result) {
        throw new Exception('Error al generar el token de activación');
    }
    
    // Intentar enviar correos
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
    } catch (Exception $e) {
        error_log("Error enviando correos de registro: " . $e->getMessage());
        $emailEnviado = false;
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Tu solicitud de registro ha sido enviada correctamente. ' . 
                     ($emailEnviado ? 'Recibirás un correo de confirmación cuando tu cuenta sea activada.' : 
                     'Un administrador activará tu cuenta pronto.')
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
