<?php
/**
 * API para procesar el formulario de solicitud de demo
 * Recibe datos del formulario y envía correo al administrador
 */

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

try {
    require_once '../config/config.php';
    require_once '../config/Mailer.php';
    require_once '../lib/RateLimit.php';
} catch (Exception $e) {
    http_response_code(500);
    error_log('Error de configuración en solicitud_demo.php');
    echo json_encode([
        'success' => false,
        'message' => 'Error de configuración del servidor'
    ]);
    exit;
}

if (!RateLimit::attempt('demo', 5, 3600)) {
    RateLimit::rejectJson();
}

try {
    // Obtener datos del formulario
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Si no hay JSON, intentar con POST normal
    if ($data === null) {
        $nombre = isset($_POST['name']) ? trim($_POST['name']) : '';
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $telefono = isset($_POST['tel']) ? trim($_POST['tel']) : '';
        $sistema = isset($_POST['select']) ? trim($_POST['select']) : '';
    } else {
        $nombre = isset($data['name']) ? trim($data['name']) : '';
        $email = isset($data['email']) ? trim($data['email']) : '';
        $telefono = isset($data['tel']) ? trim($data['tel']) : '';
        $sistema = isset($data['select']) ? trim($data['select']) : '';
    }
    
    // Validar campos requeridos
    if (empty($nombre) || empty($email) || empty($telefono) || empty($sistema)) {
        throw new Exception('Todos los campos son obligatorios');
    }
    
    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // Convertir valor del sistema a texto legible
    $sistemas_map = [
        'SistemaAsCont' => 'Sistema AsCont',
        'AplicacionAsCont' => 'Aplicación AsCont',
        'OtraOpcion' => 'Sistema y Aplicación AsCont'
    ];
    $sistema_texto = isset($sistemas_map[$sistema]) ? $sistemas_map[$sistema] : $sistema;
    
    // Preparar y enviar correo
    $subject = 'Nueva Solicitud de Demo - ' . $sistema_texto;
    $body = Mailer::templateSolicitudDemo($nombre, $email, $telefono, $sistema_texto);
    
    $mail_sent = Mailer::send(MAIL_ADMIN, $subject, $body);
    if (!$mail_sent) {
        error_log("Advertencia: No se pudo enviar el correo de solicitud de demo");
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Tu solicitud de demo ha sido enviada exitosamente. Te contactaremos pronto.'
    ]);
    
} catch (Exception $e) {
    error_log("Error en solicitud_demo.php: " . $e->getMessage());
    $mensajes_publicos = [
        'Todos los campos son obligatorios',
        'Email inválido',
    ];
    $mensaje = in_array($e->getMessage(), $mensajes_publicos, true)
        ? $e->getMessage()
        : 'No se pudo enviar la solicitud. Intente nuevamente.';
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $mensaje
    ]);
}
?>
