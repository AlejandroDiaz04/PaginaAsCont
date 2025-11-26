<?php
/**
 * API para inicio de sesión
 * Autentica al usuario y crea una sesión
 */

// Iniciar sesión
session_start();

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

try {
    // Obtener datos del formulario
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Si no hay JSON, intentar con POST normal
    if ($data === null) {
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    } else {
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';
    }
    
    // Validar campos requeridos
    if (empty($email) || empty($password)) {
        throw new Exception('Email/Usuario y contraseña son obligatorios');
    }
    
    // Conectar a la base de datos
    $db = new Database();
    
    // Buscar usuario por email o nombre (permitir login con cualquiera de los dos)
    $sql = "SELECT id, nombre, email, password, activo FROM usuarios WHERE email = ? OR nombre = ?";
    $result = $db->query($sql, [$email, $email]);
    
    $user = $db->fetch($result);
    
    if (!$user) {
        throw new Exception('Credenciales incorrectas');
    }
    
    // Verificar si la cuenta está activa (aceptar tanto boolean true como 't')
    if ($user['activo'] === false || $user['activo'] === 'f' || $user['activo'] === 0) {
        throw new Exception('Tu cuenta aún no ha sido activada. Por favor, espera la confirmación por correo.');
    }
    
    // Verificar contraseña
    if (!password_verify($password, $user['password'])) {
        throw new Exception('Credenciales incorrectas');
    }
    
    // Crear sesión
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_nombre'] = $user['nombre'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['logged_in'] = true;
    
    // Generar token de sesión para la base de datos (opcional pero recomendado)
    $token_sesion = bin2hex(random_bytes(32));
    $fecha_expiracion = date('Y-m-d H:i:s', time() + SESSION_LIFETIME);
    
    $sql = "INSERT INTO sesiones (usuario_id, token_sesion, fecha_expiracion) VALUES (?, ?, ?)";
    $db->query($sql, [$user['id'], $token_sesion, $fecha_expiracion]);
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Inicio de sesión exitoso',
        'user' => [
            'id' => $user['id'],
            'nombre' => $user['nombre'],
            'email' => $user['email']
        ],
        'redirect' => SITE_URL . '/index.html'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
