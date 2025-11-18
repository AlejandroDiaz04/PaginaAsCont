<?php
/**
 * php/admin_panel.php
 * Panel de administración para gestionar solicitudes
 */

require_once __DIR__ . '/../config.php';

// Verificar autenticación
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: /php/admin_login.php');
    exit;
}

// Verificar timeout de sesión
if (isset($_SESSION['admin_login_time']) && (time() - $_SESSION['admin_login_time']) > SESSION_TIMEOUT) {
    session_destroy();
    header('Location: /php/admin_login.php');
    exit;
}

// Actualizar tiempo de actividad
$_SESSION['admin_login_time'] = time();

// Verificar permisos (admin o usuario_premium)
$allowedRoles = ['admin', 'usuario_premium'];
if (!in_array($_SESSION['admin_rol'], $allowedRoles)) {
    die('No tiene permisos para acceder a este panel.');
}

$pdo = getDBConnection();

// Procesar acciones (eliminar, descargar CV)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'delete_demo' && isset($_POST['id'])) {
        $id = (int)$_POST['id'];
        $stmt = $pdo->prepare("DELETE FROM solicitudes_demo WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $_SESSION['admin_message'] = 'Solicitud de demo eliminada exitosamente.';
    } elseif ($action === 'delete_empleo' && isset($_POST['id'])) {
        $id = (int)$_POST['id'];
        
        // Obtener ruta del CV antes de eliminar
        $stmt = $pdo->prepare("SELECT cv_path FROM solicitudes_empleo WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $solicitud = $stmt->fetch();
        
        // Eliminar archivo CV si existe
        if ($solicitud && file_exists($solicitud['cv_path'])) {
            @unlink($solicitud['cv_path']);
        }
        
        // Eliminar registro
        $stmt = $pdo->prepare("DELETE FROM solicitudes_empleo WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $_SESSION['admin_message'] = 'Solicitud de empleo eliminada exitosamente.';
    }
    
    header('Location: /php/admin_panel.php');
    exit;
}

// Descargar CV
if (isset($_GET['download_cv']) && is_numeric($_GET['download_cv'])) {
    $id = (int)$_GET['download_cv'];
    $stmt = $pdo->prepare("SELECT cv_filename, cv_path FROM solicitudes_empleo WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $solicitud = $stmt->fetch();
    
    if ($solicitud && file_exists($solicitud['cv_path'])) {
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $solicitud['cv_filename'] . '"');
        header('Content-Length: ' . filesize($solicitud['cv_path']));
        readfile($solicitud['cv_path']);
        exit;
    } else {
        $_SESSION['admin_error'] = 'Archivo CV no encontrado.';
    }
}

// Obtener solicitudes de demo
$demosStmt = $pdo->query("SELECT * FROM solicitudes_demo ORDER BY fecha_solicitud DESC");
$demos = $demosStmt->fetchAll();

// Obtener solicitudes de empleo
$empleosStmt = $pdo->query("SELECT * FROM solicitudes_empleo ORDER BY fecha_solicitud DESC");
$empleos = $empleosStmt->fetchAll();

$adminNombre = htmlspecialchars($_SESSION['admin_nombre']);
$adminRol = htmlspecialchars($_SESSION['admin_rol']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - AsCont Systems</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 {
            font-size: 24px;
        }
        
        .header-info {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .user-info {
            font-size: 14px;
        }
        
        .logout-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 8px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 14px;
            transition: background 0.3s;
        }
        
        .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .container {
            max-width: 1400px;
            margin: 30px auto;
            padding: 0 20px;
        }
        
        .message {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .section {
            background: white;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .section h2 {
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 14px;
            opacity: 0.9;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        
        th {
            background: #f8f9fa;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }
        
        td {
            font-size: 14px;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            text-decoration: none;
            display: inline-block;
            transition: opacity 0.3s;
        }
        
        .btn:hover {
            opacity: 0.8;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        
        .btn-success {
            background: #28a745;
            color: white;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #999;
        }
        
        .actions {
            display: flex;
            gap: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>Panel de Administración</h1>
            <div class="header-info">
                <div class="user-info">
                    <strong><?php echo $adminNombre; ?></strong><br>
                    <small><?php echo ucfirst($adminRol); ?></small>
                </div>
                <a href="/php/logout.php" class="logout-btn">Cerrar Sesión</a>
            </div>
        </div>
    </div>
    
    <div class="container">
        <?php if (isset($_SESSION['admin_message'])): ?>
            <div class="message success">
                <?php 
                echo htmlspecialchars($_SESSION['admin_message']); 
                unset($_SESSION['admin_message']);
                ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['admin_error'])): ?>
            <div class="message error">
                <?php 
                echo htmlspecialchars($_SESSION['admin_error']); 
                unset($_SESSION['admin_error']);
                ?>
            </div>
        <?php endif; ?>
        
        <div class="stats">
            <div class="stat-card">
                <span class="stat-number"><?php echo count($demos); ?></span>
                <span class="stat-label">Solicitudes de Demo</span>
            </div>
            <div class="stat-card">
                <span class="stat-number"><?php echo count($empleos); ?></span>
                <span class="stat-label">Solicitudes de Empleo</span>
            </div>
        </div>
        
        <div class="section">
            <h2>Solicitudes de Demo</h2>
            <?php if (count($demos) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Sistema</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($demos as $demo): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($demo['id']); ?></td>
                                <td><?php echo date('d/m/Y H:i', strtotime($demo['fecha_solicitud'])); ?></td>
                                <td><?php echo htmlspecialchars($demo['sistema']); ?></td>
                                <td><?php echo htmlspecialchars($demo['nombre']); ?></td>
                                <td><?php echo htmlspecialchars($demo['email']); ?></td>
                                <td><?php echo htmlspecialchars($demo['telefono']); ?></td>
                                <td>
                                    <div class="actions">
                                        <form method="POST" style="display:inline;" onsubmit="return confirm('¿Está seguro de eliminar esta solicitud?');">
                                            <input type="hidden" name="action" value="delete_demo">
                                            <input type="hidden" name="id" value="<?php echo $demo['id']; ?>">
                                            <button type="submit" class="btn btn-danger">Eliminar</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">No hay solicitudes de demo registradas.</div>
            <?php endif; ?>
        </div>
        
        <div class="section">
            <h2>Solicitudes de Empleo</h2>
            <?php if (count($empleos) > 0): ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Mensaje</th>
                            <th>CV</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($empleos as $empleo): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($empleo['id']); ?></td>
                                <td><?php echo date('d/m/Y H:i', strtotime($empleo['fecha_solicitud'])); ?></td>
                                <td><?php echo htmlspecialchars($empleo['nombre']); ?></td>
                                <td><?php echo htmlspecialchars($empleo['correo']); ?></td>
                                <td><?php echo htmlspecialchars($empleo['telefono']); ?></td>
                                <td><?php echo htmlspecialchars(substr($empleo['mensaje'], 0, 50)) . '...'; ?></td>
                                <td>
                                    <a href="?download_cv=<?php echo $empleo['id']; ?>" class="btn btn-success">Descargar</a>
                                </td>
                                <td>
                                    <div class="actions">
                                        <form method="POST" style="display:inline;" onsubmit="return confirm('¿Está seguro de eliminar esta solicitud? Se eliminará también el archivo CV.');">
                                            <input type="hidden" name="action" value="delete_empleo">
                                            <input type="hidden" name="id" value="<?php echo $empleo['id']; ?>">
                                            <button type="submit" class="btn btn-danger">Eliminar</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">No hay solicitudes de empleo registradas.</div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
