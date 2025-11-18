-- ================================================
-- SQL INITIALIZATION SCRIPT FOR ASCONT BACKEND
-- ================================================
-- Este script crea las tablas necesarias para el backend PHP
-- y un usuario administrador inicial.
--
-- INSTRUCCIONES:
-- 1. Ejecutar este script en PostgreSQL:
--    psql -U postgres -d postgres -f init_postgres.sql
-- 2. Cambiar la contraseña del admin inmediatamente después del primer login
-- 3. Configurar las credenciales en config.php
--
-- NOTA: Este script asume que la base de datos 'postgres' ya existe.
-- Si necesita crear una base de datos específica, descomentar las siguientes líneas:
-- CREATE DATABASE ascont_db;
-- \c ascont_db;

-- ================================================
-- TABLA: solicitudes_demo
-- Almacena las solicitudes de demostración del sistema
-- ================================================
CREATE TABLE IF NOT EXISTS solicitudes_demo (
    id SERIAL PRIMARY KEY,
    sistema VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    fecha_solicitud TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    CONSTRAINT check_email_demo CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_demo_fecha ON solicitudes_demo(fecha_solicitud DESC);
CREATE INDEX IF NOT EXISTS idx_demo_email ON solicitudes_demo(email);

-- ================================================
-- TABLA: solicitudes_empleo
-- Almacena las solicitudes de empleo con CV adjunto
-- ================================================
CREATE TABLE IF NOT EXISTS solicitudes_empleo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    cv_filename VARCHAR(255) NOT NULL,
    cv_path TEXT NOT NULL,
    fecha_solicitud TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    CONSTRAINT check_email_empleo CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_empleo_fecha ON solicitudes_empleo(fecha_solicitud DESC);
CREATE INDEX IF NOT EXISTS idx_empleo_correo ON solicitudes_empleo(correo);

-- ================================================
-- TABLA: admin_users
-- Almacena los usuarios administradores del sistema
-- ================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'usuario_premium',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    ultimo_acceso TIMESTAMP,
    CONSTRAINT check_email_admin CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT check_rol CHECK (rol IN ('admin', 'usuario_premium'))
);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);

-- ================================================
-- INSERTAR USUARIO ADMINISTRADOR INICIAL
-- ================================================
-- Email: admin@ascont.com
-- Contraseña: 341 (CAMBIAR INMEDIATAMENTE DESPUÉS DEL PRIMER LOGIN)
-- Password hash generado con: password_hash('341', PASSWORD_DEFAULT)
--
-- IMPORTANTE: Para regenerar una contraseña segura, use el siguiente código PHP:
-- <?php echo password_hash('su_contraseña_segura', PASSWORD_DEFAULT); ?>

INSERT INTO admin_users (email, password_hash, nombre, rol, activo)
VALUES (
    'admin@ascont.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrador',
    'admin',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- ================================================
-- COMENTARIOS DE TABLAS Y COLUMNAS
-- ================================================
COMMENT ON TABLE solicitudes_demo IS 'Registro de solicitudes de demostración del sistema';
COMMENT ON TABLE solicitudes_empleo IS 'Registro de solicitudes de empleo con CVs adjuntos';
COMMENT ON TABLE admin_users IS 'Usuarios autorizados para acceder al panel administrativo';

COMMENT ON COLUMN solicitudes_demo.sistema IS 'Tipo de sistema solicitado (SistemaAsCont, AplicacionAsCont, etc.)';
COMMENT ON COLUMN solicitudes_empleo.cv_path IS 'Ruta completa del archivo CV en el servidor';
COMMENT ON COLUMN admin_users.rol IS 'Rol del usuario: admin (acceso completo) o usuario_premium (acceso limitado)';

-- ================================================
-- INSTRUCCIONES POST-INSTALACIÓN
-- ================================================
-- 
-- 1. CAMBIAR CONTRASEÑA DEL ADMINISTRADOR:
--    Inicie sesión en el panel con:
--    - Email: admin@ascont.com
--    - Contraseña: 341
--    
--    Luego ejecute en PostgreSQL:
--    UPDATE admin_users 
--    SET password_hash = '$2y$10$[NUEVO_HASH_AQUI]' 
--    WHERE email = 'admin@ascont.com';
--    
--    Para generar el hash, use este código PHP:
--    <?php echo password_hash('su_nueva_contraseña_segura', PASSWORD_DEFAULT); ?>
--
-- 2. CREAR USUARIOS ADICIONALES (OPCIONAL):
--    INSERT INTO admin_users (email, password_hash, nombre, rol)
--    VALUES ('usuario@ascont.com', '[HASH_PASSWORD]', 'Nombre Usuario', 'usuario_premium');
--
-- 3. VERIFICAR DATOS:
--    SELECT * FROM admin_users;
--    SELECT * FROM solicitudes_demo;
--    SELECT * FROM solicitudes_empleo;
--
-- 4. BACKUP RECOMENDADO:
--    pg_dump -U postgres -d postgres > backup_ascont.sql
--
-- ================================================
-- FIN DEL SCRIPT
-- ================================================

-- Mostrar resumen de tablas creadas
SELECT 'Tablas creadas exitosamente:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('solicitudes_demo', 'solicitudes_empleo', 'admin_users');

-- Mostrar usuarios administradores
SELECT 'Usuarios administradores:' as status;
SELECT id, email, nombre, rol, activo, fecha_creacion 
FROM admin_users;
