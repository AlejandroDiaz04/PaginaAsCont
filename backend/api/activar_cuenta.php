<?php
/**
 * API para activar cuenta de usuario
 * El administrador hace clic en el link del correo para activar la cuenta
 */

require_once '../config/config.php';
require_once '../config/Database.php';
require_once '../config/Mailer.php';

// Obtener token de la URL
$token = isset($_GET['token']) ? trim($_GET['token']) : '';

if (empty($token)) {
    mostrarError('Token de activación no proporcionado');
    exit;
}

try {
    // Conectar a la base de datos
    $db = new Database();
    
    // Buscar el token
    $sql = "SELECT ta.id, ta.usuario_id, ta.usado, ta.fecha_expiracion, u.nombre, u.email, u.activo 
            FROM tokens_activacion ta 
            INNER JOIN usuarios u ON ta.usuario_id = u.id 
            WHERE ta.token = ?";
    $result = $db->query($sql, [$token]);
    
    $token_data = $db->fetch($result);
    
    if (!$token_data) {
        mostrarError('Token de activación inválido');
        exit;
    }
    
    // Verificar si el token ya fue usado
    if ($token_data['usado'] === true || $token_data['usado'] === 't' || $token_data['usado'] === 1) {
        mostrarError('Este token ya fue utilizado');
        exit;
    }
    
    // Verificar si el token expiró
    if (strtotime($token_data['fecha_expiracion']) < time()) {
        mostrarError('Este token ha expirado');
        exit;
    }
    
    // Verificar si la cuenta ya está activa
    if ($token_data['activo'] === true || $token_data['activo'] === 't' || $token_data['activo'] === 1) {
        mostrarExito('Esta cuenta ya está activa', $token_data['nombre']);
        exit;
    }
    
    // Activar la cuenta - usar true para boolean
    $sql = "UPDATE usuarios SET activo = true, fecha_activacion = CURRENT_TIMESTAMP WHERE id = ?";
    $result = $db->query($sql, [$token_data['usuario_id']]);
    
    if (!$result) {
        throw new Exception('Error al activar la cuenta');
    }
    
    // Marcar el token como usado - usar true para boolean
    $sql = "UPDATE tokens_activacion SET usado = true WHERE id = ?";
    $db->query($sql, [$token_data['id']]);
    
    // Enviar correo al usuario informando que su cuenta fue activada
    try {
        Mailer::send(
            $token_data['email'],
            "¡Cuenta Activada! - AsCont System",
            Mailer::templateCuentaActivada($token_data['nombre'])
        );
    } catch (Exception $e) {
        error_log("Error enviando correo de confirmación: " . $e->getMessage());
    }
    
    // Mostrar página de éxito
    mostrarExito('Cuenta activada exitosamente', $token_data['nombre']);
    
} catch (Exception $e) {
    error_log("Error en activación: " . $e->getMessage());
    mostrarError('Error al activar la cuenta. Por favor, intente nuevamente.');
}

/**
 * Muestra página de error
 */
function mostrarError($mensaje) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - <?php echo SITE_NAME; ?></title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Montserrat', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                max-width: 500px;
                width: 100%;
                padding: 40px;
                text-align: center;
            }
            .icon {
                font-size: 80px;
                margin-bottom: 20px;
            }
            .error { color: #e74c3c; }
            h1 {
                color: #2c3e50;
                margin-bottom: 20px;
                font-size: 24px;
            }
            p {
                color: #7f8c8d;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background: #ff7a00;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                transition: background 0.3s;
            }
            .button:hover {
                background: #e66900;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon error">✖</div>
            <h1>Error de Activación</h1>
            <p><?php echo htmlspecialchars($mensaje); ?></p>
            <a href="<?php echo SITE_URL; ?>" class="button">Volver al Inicio</a>
        </div>
    </body>
    </html>
    <?php
}

/**
 * Muestra página de éxito
 */
function mostrarExito($mensaje, $nombre) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activación Exitosa - <?php echo SITE_NAME; ?></title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Montserrat', Arial, sans-serif;
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                max-width: 500px;
                width: 100%;
                padding: 40px;
                text-align: center;
            }
            .icon {
                font-size: 80px;
                margin-bottom: 20px;
            }
            .success { color: #27ae60; }
            h1 {
                color: #2c3e50;
                margin-bottom: 20px;
                font-size: 24px;
            }
            p {
                color: #7f8c8d;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .highlight {
                color: #ff7a00;
                font-weight: bold;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background: #27ae60;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                transition: background 0.3s;
                margin: 5px;
            }
            .button:hover {
                background: #229954;
            }
            .button.secondary {
                background: #ff7a00;
            }
            .button.secondary:hover {
                background: #e66900;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon success">✓</div>
            <h1>¡Cuenta Activada!</h1>
            <p><?php echo htmlspecialchars($mensaje); ?></p>
            <p>¡Hola <span class="highlight"><?php echo htmlspecialchars($nombre); ?></span>!</p>
            <p>Tu cuenta ha sido activada exitosamente. Ya puedes iniciar sesión y acceder al contenido exclusivo.</p>
            <p>Se ha enviado un correo de confirmación a tu dirección de email.</p>
            <a href="<?php echo SITE_URL; ?>/HTML/login.html" class="button">Iniciar Sesión</a>
            <a href="<?php echo SITE_URL; ?>" class="button secondary">Ir al Inicio</a>
        </div>
    </body>
    </html>
    <?php
}
?>
