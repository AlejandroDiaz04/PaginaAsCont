<?php
/**
 * ============================================================
 * Página de Login para Administradores
 * AsContSystem - admin_login.php
 * ============================================================
 * Formulario de autenticación para acceso al panel de
 * administración.
 * ============================================================
 */

// Incluir configuración
require_once __DIR__ . '/../config.php';

// Iniciar sesión
session_start();

// Si ya está autenticado, redirigir al panel
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: admin_panel.php');
    exit;
}

// Variables para mensajes
$error = '';
$success = '';

// ============================================================
// PROCESAR LOGIN
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    if (empty($email) || empty($password)) {
        $error = 'Por favor, ingrese email y contraseña';
    } else {
        try {
            $pdo = getDBConnection();
            
            $sql = "SELECT id, email, password_hash, nombre, rol, activo 
                    FROM admin_users 
                    WHERE email = :email AND activo = true";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password_hash'])) {
                // Login exitoso
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_email'] = $user['email'];
                $_SESSION['admin_nombre'] = $user['nombre'];
                $_SESSION['admin_rol'] = $user['rol'];
                $_SESSION['login_time'] = time();
                
                // Actualizar último login
                $updateSql = "UPDATE admin_users SET ultimo_login = CURRENT_TIMESTAMP WHERE id = :id";
                $updateStmt = $pdo->prepare($updateSql);
                $updateStmt->execute([':id' => $user['id']]);
                
                // Redirigir al panel
                header('Location: admin_panel.php');
                exit;
            } else {
                $error = 'Credenciales inválidas';
                logMessage("Intento de login fallido para: $email desde IP: " . getClientIP());
            }
        } catch (PDOException $e) {
            $error = 'Error al procesar la solicitud';
            logMessage("Error en admin_login.php: " . $e->getMessage());
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Panel de Administración | AsContSystem</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
            padding: 40px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo h1 {
            color: #ff7a00;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .logo p {
            color: #666;
            font-size: 14px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #ff7a00;
        }
        
        .btn-login {
            width: 100%;
            padding: 12px;
            background: #ff7a00;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .btn-login:hover {
            background: #e66a00;
        }
        
        .alert {
            padding: 12px 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .alert-error {
            background: #fee;
            color: #c33;
            border: 1px solid #fcc;
        }
        
        .alert-success {
            background: #efe;
            color: #3c3;
            border: 1px solid #cfc;
        }
        
        .footer-text {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
        
        .credentials-info {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
            font-size: 13px;
            color: #666;
        }
        
        .credentials-info strong {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>AsContSystem</h1>
            <p>Panel de Administración</p>
        </div>
        
        <?php if ($error): ?>
            <div class="alert alert-error">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <?php if ($success): ?>
            <div class="alert alert-success">
                <?php echo htmlspecialchars($success); ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required autocomplete="email">
            </div>
            
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            
            <button type="submit" class="btn-login">Iniciar Sesión</button>
        </form>
        
        <div class="credentials-info">
            <strong>Credenciales por defecto:</strong><br>
            Email: admin@ascont.com<br>
            Password: 341<br>
            <small>⚠️ Cambiar después del primer login</small>
        </div>
        
        <div class="footer-text">
            &copy; 2025 AsContSystem. Todos los derechos reservados.
        </div>
    </div>
</body>
</html>
