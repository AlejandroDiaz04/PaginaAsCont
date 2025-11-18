<?php
/**
 * php/submit_empresa.php
 * Procesamiento del formulario de solicitud de empleo
 */

require_once __DIR__ . '/../config.php';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /HTML/empresa.html');
    exit;
}

// Verificar reCAPTCHA
$recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';
if (!verifyRecaptcha($recaptchaResponse)) {
    $_SESSION['error'] = 'Por favor, complete la verificación reCAPTCHA.';
    header('Location: /HTML/empresa.html#trabajaConNosotros');
    exit;
}

// Validar y sanitizar datos del formulario
$nombre = sanitizeInput($_POST['nombre'] ?? '');
$correo = sanitizeInput($_POST['correo'] ?? '');
$telefono = sanitizeInput($_POST['telefono'] ?? '');
$mensaje = sanitizeInput($_POST['mensaje'] ?? '');

// Validaciones
$errors = [];

if (empty($nombre) || strlen($nombre) < 3) {
    $errors[] = 'El nombre debe tener al menos 3 caracteres.';
}

if (empty($correo) || !validateEmail($correo)) {
    $errors[] = 'Por favor, ingrese un correo electrónico válido.';
}

if (empty($telefono)) {
    $errors[] = 'El teléfono es requerido.';
}

if (empty($mensaje) || strlen($mensaje) < 10) {
    $errors[] = 'Por favor, escriba un mensaje de al menos 10 caracteres.';
}

// Validar archivo CV
$cvFilename = null;
$cvPath = null;

if (!isset($_FILES['cv']) || $_FILES['cv']['error'] === UPLOAD_ERR_NO_FILE) {
    $errors[] = 'Por favor, adjunte su CV.';
} else {
    $file = $_FILES['cv'];
    
    // Verificar errores en la carga
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Error al cargar el archivo. Por favor, intente nuevamente.';
    } else {
        // Verificar tamaño del archivo
        if ($file['size'] > MAX_FILE_SIZE) {
            $errors[] = 'El archivo CV no debe superar los 2MB.';
        }
        
        // Verificar extensión
        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($fileExtension, ALLOWED_EXTENSIONS)) {
            $errors[] = 'Solo se permiten archivos PDF, DOC o DOCX.';
        }
        
        // Si no hay errores, preparar el archivo para guardarlo
        if (empty($errors)) {
            $cvFilename = uniqid('cv_', true) . '.' . $fileExtension;
            $cvPath = UPLOAD_DIR . $cvFilename;
        }
    }
}

// Si hay errores, redirigir con mensaje
if (!empty($errors)) {
    $_SESSION['error'] = implode(' ', $errors);
    header('Location: /HTML/empresa.html#trabajaConNosotros');
    exit;
}

try {
    // Mover el archivo cargado
    if (!move_uploaded_file($_FILES['cv']['tmp_name'], $cvPath)) {
        throw new Exception('Error al guardar el archivo CV.');
    }
    
    // Conectar a la base de datos
    $pdo = getDBConnection();
    
    // Preparar consulta SQL
    $sql = "INSERT INTO solicitudes_empleo (nombre, correo, telefono, mensaje, cv_filename, cv_path, fecha_solicitud, ip_address) 
            VALUES (:nombre, :correo, :telefono, :mensaje, :cv_filename, :cv_path, NOW(), :ip_address)";
    
    $stmt = $pdo->prepare($sql);
    
    // Ejecutar consulta
    $stmt->execute([
        ':nombre' => $nombre,
        ':correo' => $correo,
        ':telefono' => $telefono,
        ':mensaje' => $mensaje,
        ':cv_filename' => $cvFilename,
        ':cv_path' => $cvPath,
        ':ip_address' => $_SERVER['REMOTE_ADDR']
    ]);
    
    $solicitudId = $pdo->lastInsertId();
    
    // Enviar email al administrador con CV adjunto
    $asunto = "Nueva solicitud de empleo - AsCont Systems";
    $cuerpoMensaje = "Se ha recibido una nueva solicitud de empleo.\n\n";
    $cuerpoMensaje .= "Nombre: $nombre\n";
    $cuerpoMensaje .= "Correo: $correo\n";
    $cuerpoMensaje .= "Teléfono: $telefono\n";
    $cuerpoMensaje .= "Mensaje:\n$mensaje\n\n";
    $cuerpoMensaje .= "Fecha: " . date('Y-m-d H:i:s') . "\n";
    $cuerpoMensaje .= "ID de solicitud: $solicitudId\n";
    $cuerpoMensaje .= "\nCV adjunto: $cvFilename\n";
    
    // Intentar enviar email con adjunto usando mail()
    $boundary = md5(time());
    
    $headers = "From: " . ADMIN_EMAIL_FROM_NAME . " <" . ADMIN_EMAIL_FROM . ">\r\n";
    $headers .= "Reply-To: $correo\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";
    
    $emailBody = "--{$boundary}\r\n";
    $emailBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $emailBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $emailBody .= $cuerpoMensaje . "\r\n";
    
    // Adjuntar CV
    if (file_exists($cvPath)) {
        $fileContent = chunk_split(base64_encode(file_get_contents($cvPath)));
        $emailBody .= "--{$boundary}\r\n";
        $emailBody .= "Content-Type: application/octet-stream; name=\"{$cvFilename}\"\r\n";
        $emailBody .= "Content-Transfer-Encoding: base64\r\n";
        $emailBody .= "Content-Disposition: attachment; filename=\"{$cvFilename}\"\r\n\r\n";
        $emailBody .= $fileContent . "\r\n";
    }
    
    $emailBody .= "--{$boundary}--";
    
    $emailSent = @mail(ADMIN_EMAIL_RECIPIENT, $asunto, $emailBody, $headers);
    
    if (!$emailSent) {
        // Si falla el envío, registrar en log
        $logMsg = "Error al enviar email de solicitud de empleo ID: $solicitudId\n";
        $logMsg .= "Para configurar PHPMailer/SMTP, consulte README-backend.md\n";
        $logMsg .= "Datos: Nombre: $nombre, Email: $correo, CV: $cvPath\n";
        logMessage($logMsg, 'mail_fallback.log');
    }
    
    // Redirigir a página de éxito
    $_SESSION['success'] = 'Su solicitud de empleo ha sido enviada exitosamente. Nos pondremos en contacto pronto.';
    header('Location: /php/success.php?type=empleo');
    exit;
    
} catch (Exception $e) {
    // Si hubo error y el archivo fue creado, eliminarlo
    if (isset($cvPath) && file_exists($cvPath)) {
        @unlink($cvPath);
    }
    
    // Registrar error
    logMessage("Error al procesar solicitud de empleo: " . $e->getMessage(), 'errors.log');
    
    $_SESSION['error'] = 'Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente.';
    header('Location: /HTML/empresa.html#trabajaConNosotros');
    exit;
}
