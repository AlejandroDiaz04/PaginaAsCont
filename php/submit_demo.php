<?php
/**
 * ============================================================
 * Procesador de Solicitudes de Demo
 * AsContSystem - submit_demo.php
 * ============================================================
 * Este script procesa el formulario de solicitud de demostración
 * del sistema, valida datos, verifica reCAPTCHA, guarda en BD
 * y envía notificación por email.
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
    $sistema = isset($_POST['select']) ? sanitizeInput($_POST['select']) : '';
    $nombre = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $telefono = isset($_POST['tel']) ? sanitizeInput($_POST['tel']) : '';
    $recaptchaResponse = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
    
    // Validaciones básicas
    if (empty($sistema)) {
        $response['errors'][] = 'El sistema es requerido';
    }
    
    if (empty($nombre) || strlen($nombre) < 3) {
        $response['errors'][] = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (empty($email) || !validateEmail($email)) {
        $response['errors'][] = 'Email inválido';
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
    
    $sql = "INSERT INTO solicitudes_demo 
            (sistema, nombre_completo, email, telefono, ip_address, user_agent, recaptcha_verified) 
            VALUES (:sistema, :nombre, :email, :telefono, :ip, :user_agent, :recaptcha)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':sistema' => $sistema,
        ':nombre' => $nombre,
        ':email' => $email,
        ':telefono' => $telefono,
        ':ip' => getClientIP(),
        ':user_agent' => getUserAgent(),
        ':recaptcha' => $recaptchaVerified
    ]);
    
    $solicitudId = $pdo->lastInsertId();
    
    // ============================================================
    // ENVIAR EMAIL DE NOTIFICACIÓN
    // ============================================================
    $emailSubject = "Nueva Solicitud de Demo - AsContSystem";
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
                <h2>Nueva Solicitud de Demostración</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>ID Solicitud:</span>
                    <span class='value'>#{$solicitudId}</span>
                </div>
                <div class='field'>
                    <span class='label'>Sistema Solicitado:</span>
                    <span class='value'>{$sistema}</span>
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
    
    $emailHeaders = "MIME-Version: 1.0" . "\r\n";
    $emailHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $emailHeaders .= "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM_EMAIL . ">" . "\r\n";
    
    $emailSent = false;
    
    if (!MAIL_USE_SMTP) {
        // Usar función mail() nativa de PHP
        $emailSent = @mail(ADMIN_EMAIL_RECIPIENT, $emailSubject, $emailMessage, $emailHeaders);
    } else {
        // TODO: Implementar envío con PHPMailer/SMTP si se requiere
        // Ver README-backend.md para instrucciones
        logMessage("SMTP configurado pero no implementado. Ver README-backend.md");
    }
    
    // Si el email falla, registrar en log
    if (!$emailSent) {
        $fallbackLog = [
            'fecha' => date('Y-m-d H:i:s'),
            'tipo' => 'demo',
            'destinatario' => ADMIN_EMAIL_RECIPIENT,
            'datos' => [
                'id' => $solicitudId,
                'sistema' => $sistema,
                'nombre' => $nombre,
                'email' => $email,
                'telefono' => $telefono
            ]
        ];
        
        logMessage(json_encode($fallbackLog), MAIL_FALLBACK_LOG);
        logMessage("No se pudo enviar email de notificación para solicitud #{$solicitudId}");
    }
    
    // ============================================================
    // RESPUESTA EXITOSA
    // ============================================================
    $response['success'] = true;
    $response['message'] = '¡Gracias! Tu solicitud ha sido enviada correctamente. Nos pondremos en contacto contigo pronto.';
    $response['solicitud_id'] = $solicitudId;
    
} catch (PDOException $e) {
    $response['message'] = 'Error al procesar la solicitud';
    logMessage("Error BD en submit_demo.php: " . $e->getMessage());
    
    if (DEBUG_MODE) {
        $response['errors'][] = $e->getMessage();
    }
} catch (Exception $e) {
    $response['message'] = 'Error inesperado';
    logMessage("Error en submit_demo.php: " . $e->getMessage());
    
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
