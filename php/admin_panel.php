<?php
/**
 * ============================================================
 * Panel de Administración
 * AsContSystem - admin_panel.php
 * ============================================================
 * Panel protegido para visualizar y gestionar solicitudes
 * de demo y empleo.
 * ============================================================
 */

// Incluir configuración
require_once __DIR__ . '/../config.php';

// Iniciar sesión
session_start();

// Verificar autenticación
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin_login.php');
    exit;
}

// Verificar timeout de sesión
if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > SESSION_TIMEOUT) {
    session_destroy();
    header('Location: admin_login.php?timeout=1');
    exit;
}

// Actualizar tiempo de sesión
$_SESSION['login_time'] = time();

// ============================================================
// PROCESAR ACCIONES
// ============================================================
$message = '';
$messageType = '';

// Eliminar solicitud
if (isset($_GET['delete']) && isset($_GET['type'])) {
    $id = intval($_GET['delete']);
    $type = $_GET['type'];
    
    try {
        $pdo = getDBConnection();
        
        if ($type === 'demo') {
            $sql = "DELETE FROM solicitudes_demo WHERE id = :id";
        } elseif ($type === 'empleo') {
            // Obtener CV para eliminarlo
            $sqlGet = "SELECT cv_url FROM solicitudes_empleo WHERE id = :id";
            $stmtGet = $pdo->prepare($sqlGet);
            $stmtGet->execute([':id' => $id]);
            $empleo = $stmtGet->fetch();
            
            if ($empleo && $empleo['cv_url']) {
                $cvPath = __DIR__ . '/../' . $empleo['cv_url'];
                if (file_exists($cvPath)) {
                    @unlink($cvPath);
                }
            }
            
            $sql = "DELETE FROM solicitudes_empleo WHERE id = :id";
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        
        $message = 'Solicitud eliminada correctamente';
        $messageType = 'success';
    } catch (PDOException $e) {
        $message = 'Error al eliminar solicitud';
        $messageType = 'error';
        logMessage("Error al eliminar solicitud: " . $e->getMessage());
    }
}

// ============================================================
// OBTENER DATOS
// ============================================================
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$perPage = 10;
$offset = ($page - 1) * $perPage;

try {
    $pdo = getDBConnection();
    
    // Obtener solicitudes de demo
    $sqlDemo = "SELECT * FROM solicitudes_demo ORDER BY fecha_solicitud DESC LIMIT :limit OFFSET :offset";
    $stmtDemo = $pdo->prepare($sqlDemo);
    $stmtDemo->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmtDemo->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmtDemo->execute();
    $solicitudesDemo = $stmtDemo->fetchAll();
    
    // Contar total de demos
    $sqlDemoCount = "SELECT COUNT(*) as total FROM solicitudes_demo";
    $stmtDemoCount = $pdo->query($sqlDemoCount);
    $totalDemo = $stmtDemoCount->fetch()['total'];
    
    // Obtener solicitudes de empleo
    $sqlEmpleo = "SELECT * FROM solicitudes_empleo ORDER BY fecha_solicitud DESC LIMIT :limit OFFSET :offset";
    $stmtEmpleo = $pdo->prepare($sqlEmpleo);
    $stmtEmpleo->bindValue(':limit', $perPage, PDO::PARAM_INT);
    $stmtEmpleo->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmtEmpleo->execute();
    $solicitudesEmpleo = $stmtEmpleo->fetchAll();
    
    // Contar total de empleos
    $sqlEmpleoCount = "SELECT COUNT(*) as total FROM solicitudes_empleo";
    $stmtEmpleoCount = $pdo->query($sqlEmpleoCount);
    $totalEmpleo = $stmtEmpleoCount->fetch()['total'];
    
    $totalPages = max(ceil(max($totalDemo, $totalEmpleo) / $perPage), 1);
    
} catch (PDOException $e) {
    $message = 'Error al cargar datos';
    $messageType = 'error';
    logMessage("Error en admin_panel.php: " . $e->getMessage());
    $solicitudesDemo = [];
    $solicitudesEmpleo = [];
    $totalPages = 1;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración | AsContSystem</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .btn-logout {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 16px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            text-decoration: none;
            font-size: 14px;
            transition: background 0.3s;
        }
        
        .btn-logout:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .alert {
            padding: 15px 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .stat-card h3 {
            color: #666;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 10px;
        }
        
        .stat-card .number {
            font-size: 36px;
            font-weight: 700;
            color: #ff7a00;
        }
        
        .section {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 30px;
            overflow: hidden;
        }
        
        .section-header {
            background: #f8f9fa;
            padding: 20px 30px;
            border-bottom: 1px solid #dee2e6;
        }
        
        .section-header h2 {
            color: #333;
            font-size: 20px;
        }
        
        .table-container {
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        thead {
            background: #f8f9fa;
        }
        
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 15px;
            border-top: 1px solid #dee2e6;
            font-size: 14px;
        }
        
        tbody tr:hover {
            background: #f8f9fa;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 600;
        }
        
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        
        .actions {
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 6px 12px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 12px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-view {
            background: #007bff;
            color: white;
        }
        
        .btn-view:hover {
            background: #0056b3;
        }
        
        .btn-download {
            background: #28a745;
            color: white;
        }
        
        .btn-download:hover {
            background: #218838;
        }
        
        .btn-delete {
            background: #dc3545;
            color: white;
        }
        
        .btn-delete:hover {
            background: #c82333;
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 20px;
        }
        
        .pagination a {
            padding: 8px 12px;
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            text-decoration: none;
            color: #495057;
        }
        
        .pagination a.active {
            background: #ff7a00;
            color: white;
            border-color: #ff7a00;
        }
        
        .pagination a:hover:not(.active) {
            background: #f8f9fa;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
        }
        
        .empty-state svg {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>Panel de Administración</h1>
            <div class="user-info">
                <span>👤 <?php echo htmlspecialchars($_SESSION['admin_nombre'] ?? $_SESSION['admin_email']); ?></span>
                <a href="logout.php" class="btn-logout">Cerrar Sesión</a>
            </div>
        </div>
    </div>
    
    <div class="container">
        <?php if ($message): ?>
            <div class="alert alert-<?php echo $messageType; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        
        <div class="stats">
            <div class="stat-card">
                <h3>Solicitudes de Demo</h3>
                <div class="number"><?php echo $totalDemo; ?></div>
            </div>
            <div class="stat-card">
                <h3>Solicitudes de Empleo</h3>
                <div class="number"><?php echo $totalEmpleo; ?></div>
            </div>
            <div class="stat-card">
                <h3>Total de Solicitudes</h3>
                <div class="number"><?php echo $totalDemo + $totalEmpleo; ?></div>
            </div>
        </div>
        
        <!-- Solicitudes de Demo -->
        <div class="section">
            <div class="section-header">
                <h2>📋 Solicitudes de Demostración</h2>
            </div>
            <?php if (empty($solicitudesDemo)): ?>
                <div class="empty-state">
                    <p>No hay solicitudes de demo registradas</p>
                </div>
            <?php else: ?>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Sistema</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>reCAPTCHA</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($solicitudesDemo as $demo): ?>
                                <tr>
                                    <td>#<?php echo $demo['id']; ?></td>
                                    <td><?php echo date('d/m/Y H:i', strtotime($demo['fecha_solicitud'])); ?></td>
                                    <td><?php echo htmlspecialchars($demo['sistema']); ?></td>
                                    <td><?php echo htmlspecialchars($demo['nombre_completo']); ?></td>
                                    <td><?php echo htmlspecialchars($demo['email']); ?></td>
                                    <td><?php echo htmlspecialchars($demo['telefono']); ?></td>
                                    <td>
                                        <span class="badge <?php echo $demo['recaptcha_verified'] ? 'badge-success' : 'badge-warning'; ?>">
                                            <?php echo $demo['recaptcha_verified'] ? '✓ Verificado' : '⚠ No verificado'; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="actions">
                                            <a href="?delete=<?php echo $demo['id']; ?>&type=demo" 
                                               class="btn btn-delete"
                                               onclick="return confirm('¿Está seguro de eliminar esta solicitud?')">
                                                Eliminar
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Solicitudes de Empleo -->
        <div class="section">
            <div class="section-header">
                <h2>💼 Solicitudes de Empleo</h2>
            </div>
            <?php if (empty($solicitudesEmpleo)): ?>
                <div class="empty-state">
                    <p>No hay solicitudes de empleo registradas</p>
                </div>
            <?php else: ?>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>CV</th>
                                <th>reCAPTCHA</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($solicitudesEmpleo as $empleo): ?>
                                <tr>
                                    <td>#<?php echo $empleo['id']; ?></td>
                                    <td><?php echo date('d/m/Y H:i', strtotime($empleo['fecha_solicitud'])); ?></td>
                                    <td><?php echo htmlspecialchars($empleo['nombre_completo']); ?></td>
                                    <td><?php echo htmlspecialchars($empleo['email']); ?></td>
                                    <td><?php echo htmlspecialchars($empleo['telefono']); ?></td>
                                    <td>
                                        <?php if ($empleo['cv_url']): ?>
                                            <a href="../<?php echo htmlspecialchars($empleo['cv_url']); ?>" 
                                               target="_blank" 
                                               class="btn btn-download">
                                                Descargar
                                            </a>
                                        <?php else: ?>
                                            -
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="badge <?php echo $empleo['recaptcha_verified'] ? 'badge-success' : 'badge-warning'; ?>">
                                            <?php echo $empleo['recaptcha_verified'] ? '✓ Verificado' : '⚠ No verificado'; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <div class="actions">
                                            <a href="?delete=<?php echo $empleo['id']; ?>&type=empleo" 
                                               class="btn btn-delete"
                                               onclick="return confirm('¿Está seguro de eliminar esta solicitud?')">
                                                Eliminar
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Paginación -->
        <?php if ($totalPages > 1): ?>
            <div class="pagination">
                <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                    <a href="?page=<?php echo $i; ?>" 
                       class="<?php echo $i === $page ? 'active' : ''; ?>">
                        <?php echo $i; ?>
                    </a>
                <?php endfor; ?>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
