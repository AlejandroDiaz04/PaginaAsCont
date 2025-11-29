<?php
/**
 * ============================================================
 * Procesador de Solicitudes de Empleo
 * AsContSystem - submit_empresa.php
 * ============================================================
 * Este script procesa el formulario de solicitud de empleo,
 * maneja la carga de CV, valida datos, verifica reCAPTCHA,
 * guarda en BD y envía notificación por email.
 * ============================================================
 */

// Incluir configuración
require_once __DIR__ . '/../config.php';

// ============================================================
// INICIALIZAR RESPUESTA
// ============================================================
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// ============================================================
// VERIFICAR MÉTODO POST
// ============================================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Método no permitido';
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

try {
    // ============================================================
    // VALIDAR Y SANITIZAR DATOS DEL FORMULARIO
    // ============================================================
    $nombre = isset($_POST['nombre']) ? sanitizeInput($_POST['nombre']) : '';
    $email = isset($_POST['correo']) ? sanitizeInput($_POST['correo']) : '';
    $telefono = isset($_POST['telefono']) ? sanitizeInput($_POST['telefono']) : '';
    $mensaje = isset($_POST['mensaje']) ? sanitizeInput($_POST['mensaje']) : '';
    $recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
    
    // Validaciones básicas
    if (empty($nombre) || strlen($nombre) < 3) {
        $response['errors'][] = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (empty($email) || !validateEmail($email)) {
        $response['errors'][] = 'Email inválido';
    }
    
    if (empty($telefono)) {
        $response['errors'][] = 'El teléfono es requerido';
    }
    
    // ============================================================
    // VERIFICAR reCAPTCHA
    // ============================================================
    $recaptchaVerified = false;
    
    if (!empty($recaptchaResponse)) {
        $recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
        $recaptchaData = [
            'secret' => RECAPTCHA_SECRET_KEY,
            'response' => $recaptchaResponse,
            'remoteip' => getClientIP()
        ];
        
        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($recaptchaData)
            ]
        ];
        
        $context = stream_context_create($options);
        $recaptchaResult = @file_get_contents($recaptchaUrl, false, $context);
        
        if ($recaptchaResult !== false) {
            $recaptchaJson = json_decode($recaptchaResult);
            if ($recaptchaJson && $recaptchaJson->success) {
                $recaptchaVerified = true;
            } else {
                $response['errors'][] = 'Error en la verificación reCAPTCHA';
            }
        } else {
            // Si no se puede verificar, registrar pero continuar (modo fallback)
            logMessage("No se pudo verificar reCAPTCHA para $email");
        }
    } else {
        $response['errors'][] = 'Por favor, complete el reCAPTCHA';
    }
    
    // ============================================================
    // PROCESAR ARCHIVO CV
    // ============================================================
    $cvUrl = null;
    $cvFilePath = null;
    
    if (isset($_FILES['cv']) && $_FILES['cv']['error'] !== UPLOAD_ERR_NO_FILE) {
        $file = $_FILES['cv'];
        
        // Verificar errores de carga
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $response['errors'][] = 'Error al cargar el archivo CV';
        } else {
            // Verificar tamaño
            if ($file['size'] > MAX_FILE_SIZE) {
                $response['errors'][] = 'El archivo CV no debe superar 2MB';
            }
            
            // Verificar extensión
            $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($fileExt, ALLOWED_EXTENSIONS)) {
                $response['errors'][] = 'Formato de archivo no permitido. Solo se aceptan: PDF, DOC, DOCX';
            }
            
            // Si pasa las validaciones, guardar el archivo
            if (empty($response['errors'])) {
                // Sanitizar nombre de archivo y crear nombre único
                $sanitizedName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
                $uniqueName = $sanitizedName . '_' . time() . '_' . uniqid() . '.' . $fileExt;
                $cvFilePath = UPLOAD_DIR . $uniqueName;
                
                // Mover archivo
                if (move_uploaded_file($file['tmp_name'], $cvFilePath)) {
                    $cvUrl = 'uploads/' . $uniqueName;
                } else {
                    $response['errors'][] = 'Error al guardar el archivo CV';
                    logMessage("Error al mover archivo CV a: $cvFilePath");
                }
            }
        }
    } else {
        $response['errors'][] = 'El CV es requerido';
    }
    
    // Si hay errores, detener
    if (!empty($response['errors'])) {
        $response['message'] = 'Error en la validación de datos';
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
    
    // ============================================================
    // GUARDAR EN BASE DE DATOS
    // ============================================================
    $pdo = getDBConnection();
    
    $sql = "INSERT INTO solicitudes_empleo 
            (nombre_completo, email, telefono, cv_url, mensaje, ip_address, user_agent, recaptcha_verified) 
            VALUES (:nombre, :email, :telefono, :cv_url, :mensaje, :ip, :user_agent, :recaptcha)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre' => $nombre,
        ':email' => $email,
        ':telefono' => $telefono,
        ':cv_url' => $cvUrl,
        ':mensaje' => $mensaje,
        ':ip' => getClientIP(),
        ':user_agent' => getUserAgent(),
        ':recaptcha' => $recaptchaVerified
    ]);
    
    $solicitudId = $pdo->lastInsertId();
    
    // ============================================================
    // ENVIAR EMAIL DE NOTIFICACIÓN
    // ============================================================
    $emailSubject = "Nueva Solicitud de Empleo - AsContSystem";
    $emailMessage = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff7a00; color: white; padding: 20px; text-align: center; }
            .content { background: #f4f4f4; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #333; }
            .value { color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Nueva Solicitud de Empleo</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>ID Solicitud:</span>
                    <span class='value'>#{$solicitudId}</span>
                </div>
                <div class='field'>
                    <span class='label'>Nombre Completo:</span>
                    <span class='value'>{$nombre}</span>
                </div>
                <div class='field'>
                    <span class='label'>Email:</span>
                    <span class='value'>{$email}</span>
                </div>
                <div class='field'>
                    <span class='label'>Teléfono:</span>
                    <span class='value'>{$telefono}</span>
                </div>
                <div class='field'>
                    <span class='label'>Mensaje:</span>
                    <span class='value'>" . nl2br($mensaje) . "</span>
                </div>
                <div class='field'>
                    <span class='label'>CV:</span>
                    <span class='value'>Ver adjunto</span>
                </div>
                <div class='field'>
                    <span class='label'>Fecha:</span>
                    <span class='value'>" . date('d/m/Y H:i:s') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>IP:</span>
                    <span class='value'>" . getClientIP() . "</span>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Preparar headers con adjunto si mail() está disponible
    $boundary = md5(time());
    $emailHeaders = "MIME-Version: 1.0" . "\r\n";
    $emailHeaders .= "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM_EMAIL . ">" . "\r\n";
    $emailHeaders .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"" . "\r\n";
    
    $emailBody = "--{$boundary}\r\n";
    $emailBody .= "Content-Type: text/html; charset=UTF-8\r\n";
    $emailBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $emailBody .= $emailMessage . "\r\n\r\n";
    
    // Adjuntar CV si existe
    if ($cvFilePath && file_exists($cvFilePath)) {
        $fileContent = chunk_split(base64_encode(file_get_contents($cvFilePath)));
        $emailBody .= "--{$boundary}\r\n";
        $emailBody .= "Content-Type: application/octet-stream; name=\"" . basename($cvFilePath) . "\"\r\n";
        $emailBody .= "Content-Transfer-Encoding: base64\r\n";
        $emailBody .= "Content-Disposition: attachment; filename=\"" . basename($cvFilePath) . "\"\r\n\r\n";
        $emailBody .= $fileContent . "\r\n\r\n";
    }
    
    $emailBody .= "--{$boundary}--";
    
    $emailSent = false;
    
    if (!MAIL_USE_SMTP) {
        // Usar función mail() nativa de PHP
        $emailSent = @mail(ADMIN_EMAIL_RECIPIENT, $emailSubject, $emailBody, $emailHeaders);
    } else {
        // TODO: Implementar envío con PHPMailer/SMTP si se requiere
        // Ver README-backend.md para instrucciones
        logMessage("SMTP configurado pero no implementado. Ver README-backend.md");
    }
    
    // Si el email falla, registrar en log
    if (!$emailSent) {
        $fallbackLog = [
            'fecha' => date('Y-m-d H:i:s'),
            'tipo' => 'empleo',
            'destinatario' => ADMIN_EMAIL_RECIPIENT,
            'datos' => [
                'id' => $solicitudId,
                'nombre' => $nombre,
                'email' => $email,
                'telefono' => $telefono,
                'cv' => $cvUrl
            ]
        ];
        
        logMessage(json_encode($fallbackLog), MAIL_FALLBACK_LOG);
        logMessage("No se pudo enviar email de notificación para solicitud #{$solicitudId}");
    }
    
    // ============================================================
    // RESPUESTA EXITOSA
    // ============================================================
    $response['success'] = true;
    $response['message'] = '¡Gracias! Tu solicitud ha sido enviada correctamente. Revisaremos tu CV y nos pondremos en contacto contigo pronto.';
    $response['solicitud_id'] = $solicitudId;
    
} catch (PDOException $e) {
    $response['message'] = 'Error al procesar la solicitud';
    logMessage("Error BD en submit_empresa.php: " . $e->getMessage());
    
    if (DEBUG_MODE) {
        $response['errors'][] = $e->getMessage();
    }
} catch (Exception $e) {
    $response['message'] = 'Error inesperado';
    logMessage("Error en submit_empresa.php: " . $e->getMessage());
    
    if (DEBUG_MODE) {
        $response['errors'][] = $e->getMessage();
    }
}

// ============================================================
// ENVIAR RESPUESTA
// ============================================================
header('Content-Type: application/json');
echo json_encode($response);
exit;
