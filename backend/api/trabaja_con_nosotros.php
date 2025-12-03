<?php
// Mostrar errores para debugging (quitar en producción)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Cabeceras CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
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
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }
    // Procesar archivo CV
    if (!isset($_FILES['cv']) || $_FILES['cv']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('El CV es obligatorio');
    }
    $cv = $_FILES['cv'];
    $allowed_types = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    $allowed_exts = ['pdf', 'doc', 'docx'];
    $max_size = 2 * 1024 * 1024; // 2MB
    // Validación tipo MIME
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $cv['tmp_name']);
    finfo_close($finfo);

    $extension = strtolower(pathinfo($cv['name'], PATHINFO_EXTENSION));
    if (!in_array($mime_type, $allowed_types) || !in_array($extension, $allowed_exts)) {
        throw new Exception('Solo se permiten archivos PDF o Word (.pdf, .doc, .docx)');
    }
    if ($cv['size'] > $max_size) {
        throw new Exception('El archivo es demasiado grande. Máximo 2MB');
    }
    // Crear carpeta destino si no existe
    $upload_dir = dirname(__DIR__) . '/uploads/cv/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    $filename = 'cv_' . date('YmdHis') . '_' . uniqid() . '.' . $extension;
    $filepath = $upload_dir . $filename;
    if (!move_uploaded_file($cv['tmp_name'], $filepath)) {
        throw new Exception('Error al guardar el CV');
    }

    // Enviar mail con adjunto
    $subject = "Nueva Solicitud de Empleo - $nombre";
    $body = Mailer::templateTrabajaConNosotros($nombre, $correo, $telefono, $mensaje, $filename);

    $send = Mailer::sendWithAttachment(
        MAIL_ADMIN, $subject, $body, $filepath, $cv['name']
    );
    if (!$send) throw new Exception('Error al enviar el correo. Intente luego.');

    echo json_encode([
        'success' => true,
        'message' => 'Tu solicitud ha sido enviada exitosamente. Te contactaremos pronto.'
    ]);
} catch (Exception $e) {
    error_log("TrabajaConNosotros Error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>