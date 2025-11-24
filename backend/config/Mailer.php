<?php
/**
 * Clase para envío de correos electrónicos usando PHPMailer
 */

// Importar clases de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../lib/PHPMailer.php';
require_once __DIR__ . '/../lib/Exception.php';
require_once __DIR__ . '/../lib/SMTP.php';

class Mailer {
    
    /**
     * Envía un correo electrónico usando PHPMailer
     * 
     * @param string $to Destinatario
     * @param string $subject Asunto
     * @param string $message Mensaje en HTML
     * @param string $from Remitente (opcional)
     * @return bool
     */
    public static function send($to, $subject, $message, $from = null) {
        if ($from === null) {
            $from = MAIL_FROM;
        }
        
        $mail = new PHPMailer(true);
        
        try {
            // Configuración del servidor SMTP
            $mail->isSMTP();
            $mail->Host       = MAIL_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = MAIL_USERNAME;
            $mail->Password   = MAIL_PASSWORD;
            $mail->SMTPSecure = MAIL_ENCRYPTION;
            $mail->Port       = MAIL_PORT;
            $mail->CharSet    = 'UTF-8';
            
            // Desactivar verificación SSL en desarrollo (eliminar en producción)
            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );
            
            // Destinatarios
            $mail->setFrom($from, MAIL_FROM_NAME);
            $mail->addAddress($to);
            
            // Contenido
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $message;
            $mail->AltBody = strip_tags($message);
            
            $mail->send();
            return true;
            
        } catch (Exception $e) {
            error_log("Error al enviar correo: {$mail->ErrorInfo}");
            return false;
        }
    }
    
    /**
     * Plantilla HTML para correo de activación de cuenta (ADMIN)
     */
    public static function templateActivacionAdmin($nombre, $email, $token) {
        $activationLink = SITE_URL . '/backend/api/activar_cuenta.php?token=' . $token;
        
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #ff7a00; color: white; padding: 20px; text-align: center; }
                .content { background: #f4f4f4; padding: 30px; }
                .button { 
                    display: inline-block; 
                    padding: 12px 30px; 
                    background: #28a745; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .info-box { 
                    background: white; 
                    padding: 15px; 
                    border-left: 4px solid #ff7a00; 
                    margin: 20px 0; 
                }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nueva Solicitud de Registro</h1>
                    <p style="margin: 0; font-size: 14px;">AsCont System</p>
                </div>
                <div class="content">
                    <h2>Solicitud de Acceso Pendiente</h2>
                    <p>El usuario <strong>' . htmlspecialchars($nombre) . '</strong> ha solicitado acceso a la plataforma AsCont System.</p>
                    
                    <div class="info-box">
                        <p style="margin: 5px 0;"><strong>Nombre:</strong> ' . htmlspecialchars($nombre) . '</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ' . htmlspecialchars($email) . '</p>
                        <p style="margin: 5px 0;"><strong>Fecha de solicitud:</strong> ' . date('d/m/Y H:i:s') . '</p>
                    </div>
                    
                    <p>Para activar esta cuenta y permitir el acceso al contenido exclusivo, haz clic en el siguiente botón:</p>
                    
                    <p style="text-align: center;">
                        <a href="' . $activationLink . '" class="button">✓ Activar Cuenta</a>
                    </p>
                    
                    <p style="font-size: 12px; color: #666;">O copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; font-size: 11px; color: #999;">' . $activationLink . '</p>
                    
                    <p style="margin-top: 30px; padding: 10px; background: #fff3cd; border-radius: 5px;">
                        <strong>⚠️ Nota:</strong> Este enlace expirará en 48 horas. Una vez activada la cuenta, el usuario recibirá un correo de confirmación automáticamente.
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 AsCont System. Panel de Administración.</p>
                </div>
            </div>
        </body>
        </html>
        ';
    }
    
    /**
     * Plantilla HTML para confirmar recepción de solicitud (USUARIO)
     */
    public static function templateSolicitudRecibida($nombre) {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #667eea; color: white; padding: 20px; text-align: center; }
                .content { background: #f4f4f4; padding: 30px; }
                .icon { font-size: 60px; text-align: center; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>AsCont System</h1>
                </div>
                <div class="content">
                    <div class="icon">📧</div>
                    <h2 style="text-align: center;">¡Solicitud Recibida!</h2>
                    <p>Hola <strong>' . htmlspecialchars($nombre) . '</strong>,</p>
                    <p>Tu solicitud de registro en <strong>AsCont System</strong> ha sido recibida correctamente.</p>
                    <p>Nuestro equipo revisará tu solicitud y te enviaremos un correo de confirmación cuando tu cuenta sea activada.</p>
                    <p style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>📌 ¿Qué sigue?</strong><br>
                        Una vez que tu cuenta sea activada, recibirás un correo de confirmación y podrás acceder al contenido exclusivo para clientes de AsCont System.
                    </p>
                    <p>Gracias por tu interés en nuestros servicios.</p>
                    <p style="margin-top: 30px;">
                        Saludos cordiales,<br>
                        <strong>Equipo AsCont System</strong>
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 AsCont System. Todos los derechos reservados.</p>
                    <p style="margin-top: 10px;">
                        <a href="tel:+595219693302" style="color: #ff7a00; text-decoration: none;">📞 (021) 969-302</a> | 
                        <a href="https://wa.me/595971242742" style="color: #ff7a00; text-decoration: none;">📱 WhatsApp</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        ';
    }
    
    /**
     * Plantilla HTML para confirmar activación de cuenta (USUARIO)
     */
    public static function templateCuentaActivada($nombre) {
        $loginUrl = SITE_URL . '/HTML/login.html';
        
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #28a745; color: white; padding: 20px; text-align: center; }
                .content { background: #f4f4f4; padding: 30px; }
                .icon { font-size: 60px; text-align: center; margin: 20px 0; }
                .button { 
                    display: inline-block; 
                    padding: 12px 30px; 
                    background: #667eea; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>¡Cuenta Activada!</h1>
                </div>
                <div class="content">
                    <div class="icon">✅</div>
                    <h2 style="text-align: center;">¡Bienvenido a AsCont System!</h2>
                    <p>Hola <strong>' . htmlspecialchars($nombre) . '</strong>,</p>
                    <p>Nos complace informarte que tu cuenta ha sido <strong>activada exitosamente</strong>.</p>
                    <p style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                        <strong>🎉 ¡Tu cuenta está lista!</strong><br>
                        Ya puedes iniciar sesión y acceder a todo el contenido exclusivo para clientes de AsCont System.
                    </p>
                    <p style="text-align: center;">
                        <a href="' . $loginUrl . '" class="button">🔐 Iniciar Sesión</a>
                    </p>
                    <p>Una vez dentro, tendrás acceso a:</p>
                    <ul style="background: white; padding: 20px 20px 20px 40px; border-radius: 5px;">
                        <li>📊 Documentación exclusiva</li>
                        <li>💼 Recursos para clientes</li>
                        <li>🎓 Tutoriales y guías</li>
                        <li>📞 Soporte prioritario</li>
                    </ul>
                    <p style="margin-top: 30px;">
                        Si tienes alguna pregunta, no dudes en contactarnos.<br><br>
                        Saludos cordiales,<br>
                        <strong>Equipo AsCont System</strong>
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 AsCont System. Todos los derechos reservados.</p>
                    <p style="margin-top: 10px;">
                        <a href="tel:+595219693302" style="color: #ff7a00; text-decoration: none;">📞 (021) 969-302</a> | 
                        <a href="https://wa.me/595971242742" style="color: #ff7a00; text-decoration: none;">📱 WhatsApp</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        ';
    }
    
    /**
     * Plantilla HTML para notificación de solicitud de trabajo
     */
    public static function templateTrabajaConNosotros($nombre, $email, $telefono, $mensaje, $cvPath) {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #ff7a00; color: white; padding: 20px; text-align: center; }
                .content { background: #f4f4f4; padding: 30px; }
                .info-row { margin: 10px 0; }
                .label { font-weight: bold; color: #ff7a00; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nueva Solicitud de Empleo</h1>
                </div>
                <div class="content">
                    <h2>Información del Candidato</h2>
                    <div class="info-row">
                        <span class="label">Nombre:</span> ' . htmlspecialchars($nombre) . '
                    </div>
                    <div class="info-row">
                        <span class="label">Email:</span> ' . htmlspecialchars($email) . '
                    </div>
                    <div class="info-row">
                        <span class="label">Teléfono:</span> ' . htmlspecialchars($telefono) . '
                    </div>
                    <div class="info-row">
                        <span class="label">Mensaje:</span><br>
                        ' . nl2br(htmlspecialchars($mensaje)) . '
                    </div>
                    <div class="info-row">
                        <span class="label">CV:</span> Adjunto en el servidor: ' . htmlspecialchars($cvPath) . '
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2025 ' . SITE_NAME . '</p>
                </div>
            </div>
        </body>
        </html>
        ';
    }
    
    /**
     * Plantilla HTML para solicitud de demo
     */
    public static function templateSolicitudDemo($nombre, $email, $telefono, $sistema) {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #ff7a00; color: white; padding: 20px; text-align: center; }
                .content { background: #f4f4f4; padding: 30px; }
                .info-row { margin: 10px 0; }
                .label { font-weight: bold; color: #ff7a00; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nueva Solicitud de Demo</h1>
                </div>
                <div class="content">
                    <h2>Información del Solicitante</h2>
                    <div class="info-row">
                        <span class="label">Nombre:</span> ' . htmlspecialchars($nombre) . '
                    </div>
                    <div class="info-row">
                        <span class="label">Email:</span> ' . htmlspecialchars($email) . '
                    </div>
                    <div class="info-row">
                        <span class="label">Teléfono:</span> ' . htmlspecialchars($telefono) . '
                    </div>
                    <div class="info-row">
                        <span class="label">Sistema Solicitado:</span> ' . htmlspecialchars($sistema) . '
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2025 ' . SITE_NAME . '</p>
                </div>
            </div>
        </body>
        </html>
        ';
    }
}
?>
