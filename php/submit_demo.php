<?php
/**
 * php/submit_demo.php
 * Procesamiento del formulario de solicitud de demo
 */

require_once __DIR__ . '/../config.php';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /HTML/demo.html');
    exit;
}

// Verificar reCAPTCHA
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';
if (!verifyRecaptcha($recaptchaResponse)) {
    $_SESSION['error'] = 'Por favor, complete la verificación reCAPTCHA.';
    header('Location: /HTML/demo.html');
    exit;
}

// Validar y sanitizar datos del formulario
$sistema = sanitizeInput($_POST['select'] ?? '');
$nombre = sanitizeInput($_POST['name'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$telefono = sanitizeInput($_POST['tel'] ?? '');

// Validaciones
$errors = [];

if (empty($nombre) || strlen($nombre) < 3 || strlen($nombre) > 50) {
    $errors[] = 'El nombre debe tener entre 3 y 50 caracteres.';
}

if (empty($email) || !validateEmail($email)) {
    $errors[] = 'Por favor, ingrese un correo electrónico válido.';
}

if (empty($sistema)) {
    $errors[] = 'Por favor, seleccione un sistema para la demo.';
}

if (!empty($telefono) && !preg_match('/^[0-9+ ]+$/', $telefono)) {
    $errors[] = 'El teléfono solo debe contener números, espacios y el símbolo +.';
}

// Si hay errores, redirigir con mensaje
if (!empty($errors)) {
    $_SESSION['error'] = implode(' ', $errors);
    header('Location: /HTML/demo.html');
    exit;
}

try {
    // Conectar a la base de datos
    $pdo = getDBConnection();
    
    // Preparar consulta SQL
    $sql = "INSERT INTO solicitudes_demo (sistema, nombre, email, telefono, fecha_solicitud, ip_address) 
            VALUES (:sistema, :nombre, :email, :telefono, NOW(), :ip_address)";
    
    $stmt = $pdo->prepare($sql);
    
    // Ejecutar consulta
    $stmt->execute([
        ':sistema' => $sistema,
        ':nombre' => $nombre,
        ':email' => $email,
        ':telefono' => $telefono,
        ':ip_address' => $_SERVER['REMOTE_ADDR']
    ]);
    
    $solicitudId = $pdo->lastInsertId();
    
    // Enviar email al administrador
    $asunto = "Nueva solicitud de demo - AsCont Systems";
    $mensaje = "Se ha recibido una nueva solicitud de demo.\n\n";
    $mensaje .= "Sistema solicitado: $sistema\n";
    $mensaje .= "Nombre: $nombre\n";
    $mensaje .= "Email: $email\n";
    $mensaje .= "Teléfono: $telefono\n";
    $mensaje .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
    $mensaje .= "ID de solicitud: $solicitudId\n";
    
    $headers = "From: " . ADMIN_EMAIL_FROM_NAME . " <" . ADMIN_EMAIL_FROM . ">\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    $emailSent = @mail(ADMIN_EMAIL_RECIPIENT, $asunto, $mensaje, $headers);
    
    if (!$emailSent) {
        // Si falla el envío, registrar en log
        logMessage("Error al enviar email de solicitud de demo ID: $solicitudId", 'mail_fallback.log');
    }
    
    // Redirigir a página de éxito
    $_SESSION['success'] = 'Su solicitud de demo ha sido enviada exitosamente. Nos pondremos en contacto pronto.';
    header('Location: /php/success.php?type=demo');
    exit;
    
} catch (Exception $e) {
    // Registrar error
    logMessage("Error al procesar solicitud de demo: " . $e->getMessage(), 'errors.log');
    
    $_SESSION['error'] = 'Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente.';
    header('Location: /HTML/demo.html');
    exit;
}
