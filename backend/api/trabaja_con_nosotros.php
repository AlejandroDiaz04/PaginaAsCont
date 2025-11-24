<?php
/**
 * API para procesar el formulario "Trabaja con nosotros"
 * Recibe datos del formulario y envía correo al administrador con CV adjunto
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
require_once '../config/Mailer.php';

try {
    // Validar campos requeridos
    $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    $correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
    $telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
    $mensaje = isset($_POST['mensaje']) ? trim($_POST['mensaje']) : '';
    
    if (empty($nombre) || empty($correo) || empty($telefono) || empty($mensaje)) {
        throw new Exception('Todos los campos son obligatorios');
    }
    
    // Validar email
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    
    // Procesar archivo CV
    if (!isset($_FILES['cv']) || $_FILES['cv']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('El CV es obligatorio');
    }
    
    $cv = $_FILES['cv'];
    $allowed_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    $max_size = 5 * 1024 * 1024; // 5MB
    
    // Validar tipo de archivo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $cv['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime_type, $allowed_types)) {
        throw new Exception('Solo se permiten archivos PDF o Word');
    }
    
    // Validar tamaño
    if ($cv['size'] > $max_size) {
        throw new Exception('El archivo es demasiado grande. Máximo 5MB');
    }
    
    // Crear directorio para CVs si no existe
    $upload_dir = dirname(__DIR__) . '/uploads/cv/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    // Generar nombre único para el archivo
    $extension = pathinfo($cv['name'], PATHINFO_EXTENSION);
    $filename = 'cv_' . date('YmdHis') . '_' . uniqid() . '.' . $extension;
    $filepath = $upload_dir . $filename;
    
    // Mover archivo
    if (!move_uploaded_file($cv['tmp_name'], $filepath)) {
        throw new Exception('Error al guardar el CV');
    }
    
    // Preparar y enviar correo
    $subject = 'Nueva Solicitud de Empleo - ' . $nombre;
    $body = Mailer::templateTrabajaConNosotros($nombre, $correo, $telefono, $mensaje, $filename);
    
    $mail_sent = Mailer::send(MAIL_ADMIN, $subject, $body);
    if (!$mail_sent) {
        error_log("Advertencia: No se pudo enviar el correo de solicitud de empleo");
    }
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Tu solicitud ha sido enviada exitosamente. Te contactaremos pronto.'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
