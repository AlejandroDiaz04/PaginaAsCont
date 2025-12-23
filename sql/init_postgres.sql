-- ============================================================
-- Script de Inicialización de Base de Datos PostgreSQL
-- AsContSystem - Backend Forms Processing
-- ============================================================
-- Este script crea las tablas necesarias para el sistema de
-- formularios y administración.
-- ============================================================

-- Crear tabla para solicitudes de demo
CREATE TABLE IF NOT EXISTS solicitudes_demo (
    id SERIAL PRIMARY KEY,
    sistema VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(50),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    recaptcha_verified BOOLEAN DEFAULT FALSE
);

-- Índices para solicitudes_demo
CREATE INDEX idx_demo_email ON solicitudes_demo(email);
CREATE INDEX idx_demo_fecha ON solicitudes_demo(fecha_solicitud DESC);

-- Crear tabla para solicitudes de empleo
CREATE TABLE IF NOT EXISTS solicitudes_empleo (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    cv_url VARCHAR(255),
    mensaje TEXT,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    recaptcha_verified BOOLEAN DEFAULT FALSE
);

-- Índices para solicitudes_empleo
CREATE INDEX idx_empleo_email ON solicitudes_empleo(email);
CREATE INDEX idx_empleo_fecha ON solicitudes_empleo(fecha_solicitud DESC);

-- Crear tabla para usuarios administradores
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    rol VARCHAR(50) DEFAULT 'admin',
    activo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para admin_users
CREATE INDEX idx_admin_email ON admin_users(email);

-- ============================================================
-- INSERTAR USUARIO ADMINISTRADOR INICIAL
-- ============================================================
-- Email: admin@ascont.com
-- Password: 341
-- IMPORTANTE: Cambiar la contraseña después de la primera sesión
-- ============================================================

INSERT INTO admin_users (email, password_hash, nombre, rol)
VALUES (
    'admin@ascont.com',
    '$2y$10$ensu9eN03SFqtK0Reh6BcuhQ7t.NEdMWeNul.5nlBZz7xFWB3btsu',
    'Administrador',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- COMENTARIOS Y NOTAS
-- ============================================================
-- Para regenerar el hash de contraseña, ejecutar en PHP:
-- php -r "echo password_hash('tu_nueva_contraseña', PASSWORD_DEFAULT);"
-- 
-- Luego actualizar con:
-- UPDATE admin_users 
-- SET password_hash = 'hash_generado' 
-- WHERE email = 'admin@ascont.com';
-- ============================================================

-- Crear tabla para logs de emails fallidos (opcional)
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- 'demo' o 'empleo'
    destinatario VARCHAR(150),
    asunto VARCHAR(255),
    mensaje TEXT,
    error TEXT,
    fecha_intento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentarios en las tablas
COMMENT ON TABLE solicitudes_demo IS 'Almacena solicitudes de demostración del sistema';
COMMENT ON TABLE solicitudes_empleo IS 'Almacena solicitudes de empleo con CV adjunto';
COMMENT ON TABLE admin_users IS 'Usuarios con acceso al panel de administración';
COMMENT ON TABLE email_logs IS 'Log de intentos de envío de emails';

-- Confirmar que las tablas se crearon correctamente
SELECT 'Tablas creadas exitosamente:' AS mensaje;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
AND tablename IN ('solicitudes_demo', 'solicitudes_empleo', 'admin_users', 'email_logs');
