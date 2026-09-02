-- Base de datos: pagina_web
-- Owner: postgres
-- Versión: PostgreSQL 9.3

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_activacion TIMESTAMP NULL
);

-- Tabla de tokens de activación
CREATE TABLE IF NOT EXISTS tokens_activacion (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL
);

-- Tabla de sesiones (opcional, para mayor seguridad)
CREATE TABLE IF NOT EXISTS sesiones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    token_sesion VARCHAR(64) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_tokens_token ON tokens_activacion(token);
CREATE INDEX idx_tokens_usuario ON tokens_activacion(usuario_id);
CREATE INDEX idx_sesiones_token ON sesiones(token_sesion);
CREATE INDEX idx_sesiones_usuario ON sesiones(usuario_id);

-- Comentarios
COMMENT ON TABLE usuarios IS 'Tabla de usuarios registrados en el sistema';
COMMENT ON TABLE tokens_activacion IS 'Tokens para activación de cuentas de usuario';
COMMENT ON TABLE sesiones IS 'Sesiones activas de usuarios';
