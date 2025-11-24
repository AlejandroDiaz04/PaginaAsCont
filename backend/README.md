# Backend AsContSystem

Sistema backend completo para gestión de formularios y autenticación de usuarios.

## 🚀 Características

- ✅ Formulario "Trabaja con nosotros" con envío por correo
- ✅ Formulario de solicitud de demo
- ✅ Sistema de registro de usuarios con activación por correo
- ✅ Sistema de login con sesiones
- ✅ Página de contenido exclusivo para clientes
- ✅ Base de datos PostgreSQL 9.3

## 📋 Requisitos

- PHP 7.4 o superior
- PostgreSQL 9.3 o superior
- Servidor web (Apache/Nginx) o PHP Built-in Server
- Extensión PHP: pgsql, mbstring, openssl

## ⚙️ Instalación

### 1. Configurar Base de Datos

Ejecuta el script SQL para crear las tablas:

```bash
psql -U postgres -d pagina_web -f backend/database/schema.sql
```

O desde pgAdmin:

1. Abre pgAdmin
2. Conecta al servidor PostgreSQL
3. Selecciona la base de datos `pagina_web`
4. Ejecuta el contenido de `backend/database/schema.sql`

### 2. Configurar el Backend

Edita el archivo `backend/config/config.php` y configura:

#### Conexión a Base de Datos (ya configurado):

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'pagina_web');
define('DB_USER', 'postgres');
define('DB_PASS', 'assoftware');
```

#### Configuración de Correo:

```php
// Para Gmail (recomendado para pruebas)
define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_PORT', 587);
define('MAIL_USERNAME', 'tu-email@gmail.com');
define('MAIL_PASSWORD', 'tu-contraseña-de-aplicación');
define('MAIL_FROM', 'tu-email@gmail.com');
define('MAIL_ENCRYPTION', 'tls');

// Correo donde recibirás las notificaciones
define('MAIL_ADMIN', 'tu-correo-admin@gmail.com');
```

**IMPORTANTE para Gmail:**

1. Ir a tu cuenta de Google
2. Activar verificación en 2 pasos
3. Generar una "Contraseña de aplicación" en: https://myaccount.google.com/apppasswords
4. Usar esa contraseña en `MAIL_PASSWORD`

#### URL del Sitio:

```php
define('SITE_URL', 'http://localhost'); // Cambiar en producción
```

### 3. Permisos de Carpetas

Asegúrate de que PHP pueda escribir en la carpeta de uploads:

```bash
# En Windows (PowerShell como Administrador)
icacls "backend\uploads" /grant "IIS_IUSRS:(OI)(CI)F"

# O simplemente asegúrate de que la carpeta tenga permisos de escritura
```

### 4. Iniciar el Servidor

Opción 1: PHP Built-in Server (desarrollo)

```bash
php -S localhost:8000
```

Opción 2: Configurar en XAMPP/WAMP

- Copiar el proyecto a la carpeta `htdocs`
- Acceder a `http://localhost/paginaWeb - copia/`

Opción 3: IIS en Windows

- Configurar un sitio web apuntando a la carpeta del proyecto
- Asegurarse de tener PHP configurado en IIS

## 🔧 Configuración Adicional

### Habilitar extensiones PHP

Editar `php.ini` y descomentar:

```ini
extension=pgsql
extension=pdo_pgsql
extension=mbstring
extension=openssl
```

### Configuración para Producción

Editar `backend/config/config.php`:

```php
// Desactivar errores en producción
error_reporting(0);
ini_set('display_errors', 0);

// Cambiar URL del sitio
define('SITE_URL', 'https://tu-dominio.com');
```

## 📁 Estructura del Backend

```
backend/
├── api/
│   ├── activar_cuenta.php      # Activación de cuentas
│   ├── check_session.php       # Verificar sesión activa
│   ├── login.php               # Inicio de sesión
│   ├── logout.php              # Cerrar sesión
│   ├── registro.php            # Registro de usuarios
│   ├── solicitud_demo.php      # Solicitud de demo
│   └── trabaja_con_nosotros.php # Solicitud de empleo
├── config/
│   ├── config.php              # Configuración general
│   ├── Database.php            # Clase de conexión DB
│   └── Mailer.php              # Clase de envío de correos
├── database/
│   └── schema.sql              # Estructura de base de datos
└── uploads/
    └── cv/                     # CVs subidos
```

## 🔐 Flujo de Autenticación

### Registro de Usuario:

1. Usuario completa formulario de registro en `login.html`
2. Sistema crea usuario **inactivo** en la base de datos
3. Genera token de activación único
4. Envía correo al administrador con link de activación
5. Administrador hace clic en el link para activar la cuenta
6. Usuario recibe correo de confirmación de activación
7. Usuario puede iniciar sesión

### Inicio de Sesión:

1. Usuario ingresa email y contraseña
2. Sistema verifica que la cuenta esté activa
3. Valida credenciales
4. Crea sesión PHP
5. Registra sesión en base de datos
6. Redirige a página de contenido exclusivo

## 📧 Configuración de Correos

### Proveedores Soportados:

**Gmail:**

```php
define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_PORT', 587);
define('MAIL_ENCRYPTION', 'tls');
```

**Outlook/Hotmail:**

```php
define('MAIL_HOST', 'smtp-mail.outlook.com');
define('MAIL_PORT', 587);
define('MAIL_ENCRYPTION', 'tls');
```

**Yahoo:**

```php
define('MAIL_HOST', 'smtp.mail.yahoo.com');
define('MAIL_PORT', 587);
define('MAIL_ENCRYPTION', 'tls');
```

## 🧪 Pruebas

### Probar Formulario de Demo:

1. Ir a `/HTML/demo.html`
2. Completar formulario
3. Verificar que llegue el correo a `MAIL_ADMIN`

### Probar Trabaja con Nosotros:

1. Ir a `/HTML/empresa.html#trabajaConNosotros`
2. Completar formulario y adjuntar CV
3. Verificar correo en `MAIL_ADMIN`
4. Verificar que el CV se guardó en `backend/uploads/cv/`

### Probar Registro y Login:

1. Ir a `/HTML/login.html`
2. Hacer clic en "Sign Up"
3. Completar formulario de registro
4. Verificar correo de activación en `MAIL_ADMIN`
5. Hacer clic en el link de activación
6. Usuario recibirá correo de confirmación
7. Iniciar sesión con las credenciales
8. Debe redirigir a `/HTML/contenido_exclusivo.html`

## ⚠️ Solución de Problemas

### Error de conexión a PostgreSQL:

- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `config.php`
- Verificar que la base de datos `pagina_web` exista

### Error al enviar correos:

- Verificar configuración de correo en `config.php`
- Para Gmail, usar contraseña de aplicación
- Verificar que el puerto no esté bloqueado por firewall

### Error al subir archivos:

- Verificar permisos de escritura en `backend/uploads/`
- Verificar límite de tamaño en `php.ini`:
  ```ini
  upload_max_filesize = 10M
  post_max_size = 10M
  ```

### Sesiones no funcionan:

- Verificar que las sesiones estén habilitadas en `php.ini`
- Verificar permisos en la carpeta de sesiones de PHP

## 📝 Notas de Seguridad

- ✅ Contraseñas hasheadas con `password_hash()`
- ✅ Consultas preparadas para prevenir SQL injection
- ✅ Validación de tipos de archivo en uploads
- ✅ Tokens únicos para activación de cuentas
- ✅ Sesiones con expiración

**Para producción:**

- Cambiar `error_reporting` a 0
- Usar HTTPS
- Configurar CORS adecuadamente
- Implementar rate limiting
- Usar variables de entorno para credenciales sensibles

## 📞 Soporte

Para problemas o consultas:

- Email: soporte@ascontsystem.com
- Teléfono: (021) 969-302
- WhatsApp: (0971) 242-742

## 📄 Licencia

© 2025 AsContSystem. Todos los derechos reservados.
