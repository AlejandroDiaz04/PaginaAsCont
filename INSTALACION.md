
## ✅ Lo que se ha creado

### 1. **Base de Datos PostgreSQL**

- **Archivo:** `database/schema.sql`
- **Tablas:**
  - `usuarios` - Almacena usuarios registrados
  - `tokens_activacion` - Tokens para activar cuentas
  - `sesiones` - Sesiones activas de usuarios

### 2. **Sistema de Formularios**

- ✅ Formulario "Trabaja con nosotros" → Envía correo con CV adjunto
- ✅ Formulario "Solicitud de Demo" → Envía correo con datos del interesado
- ✅ Ambos envían correos a tu email administrativo

### 3. **Sistema de Autenticación**

- ✅ Registro de usuarios (requiere activación)
- ✅ Activación de cuentas por link en correo
- ✅ Login funcional con sesiones PHP
- ✅ Página de contenido exclusivo para usuarios autenticados
- ✅ Logout con limpieza de sesión

### 4. **Páginas Actualizadas**

- `HTML/login.html` - Formularios de registro y login
- `HTML/empresa.html` - Formulario "Trabaja con nosotros"
- `HTML/demo.html` - Formulario de solicitud de demo
- `HTML/contenido_exclusivo.html` - Página para clientes (nueva)

## 📝 PASOS DE INSTALACIÓN

### PASO 1: Instalar Base de Datos

**Opción A - Usando el script PowerShell:**

```powershell
cd database
.\install.ps1
```

**Opción B - Manual:**

1. Abre pgAdmin o psql
2. Conéctate a PostgreSQL con el usuario y contraseña de tu entorno local
3. Ejecuta el archivo `database/schema.sql`

### PASO 2: Configurar Correo Electrónico

Edita `backend/config/config.php` líneas 14-21:

```php
// CAMBIAR ESTOS VALORES:
define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_PORT', 587);
define('MAIL_USERNAME', 'TU-EMAIL@gmail.com');  // ← CAMBIAR
define('MAIL_PASSWORD', 'TU-CONTRASEÑA-APP');   // ← CAMBIAR
define('MAIL_FROM', 'TU-EMAIL@gmail.com');      // ← CAMBIAR
define('MAIL_ADMIN', 'EMAIL-DONDE-RECIBIRAS@gmail.com'); // ← CAMBIAR
```

**Para Gmail:**

1. Ir a: https://myaccount.google.com/security
2. Activar "Verificación en 2 pasos"
3. Ir a: https://myaccount.google.com/apppasswords
4. Crear contraseña de aplicación para "Correo"
5. Usar esa contraseña en `MAIL_PASSWORD`

### PASO 3: Iniciar Servidor

**Opción A - PHP Built-in (más fácil):**

```powershell
cd "C:\Users\Soporte\Documents\paginaWeb - copia"
php -S localhost:8000
```

Luego abrir: http://localhost:8000

**Opción B - XAMPP/WAMP:**

1. Copiar proyecto a `htdocs`
2. Abrir: http://localhost/paginaWeb - copia/

**Opción C - IIS:**

1. Configurar sitio en IIS apuntando a la carpeta del proyecto
2. Asegurarse de tener PHP configurado

## 🧪 PROBAR EL SISTEMA

### 1️⃣ Probar Formulario de Demo

1. Ir a: http://localhost:8000/HTML/demo.html
2. Completar formulario
3. Verificar que llegue correo a tu `MAIL_ADMIN`

### 2️⃣ Probar Trabaja con Nosotros

1. Ir a: http://localhost:8000/HTML/empresa.html
2. Scroll hasta "Trabaja con nosotros"
3. Completar formulario y adjuntar CV (PDF o Word)
4. Verificar correo en `MAIL_ADMIN`
5. El CV se guarda en: `backend/uploads/cv/`

### 3️⃣ Probar Registro y Login

**Registrar Usuario:**

1. Ir a: http://localhost:8000/HTML/login.html
2. Click en "Sign Up"
3. Llenar formulario (nombre, email, contraseña)
4. Click "Sign Up"
5. Verás mensaje: "Tu solicitud de registro ha sido enviada"

**Activar Cuenta:** 6. Revisar tu `MAIL_ADMIN` - llegará correo con link de activación 7. Hacer click en "Activar Cuenta" del correo 8. Verás página de confirmación 9. El usuario recibirá correo de cuenta activada

**Iniciar Sesión:** 10. Volver a: http://localhost:8000/HTML/login.html 11. Ingresar email y contraseña 12. Click "Sign In" 13. Redirige a: http://localhost:8000/HTML/contenido_exclusivo.html 14. Verás tu nombre en la página

**Cerrar Sesión:** 15. Click en "Cerrar Sesión" 16. Vuelve al login

## 📂 ESTRUCTURA DE ARCHIVOS

```
PaginaAsCont/
├── index.html
├── HTML/                       # URLs públicas /HTML/*.html
├── assets/
│   ├── css/
│   │   └── pages/
│   ├── js/
│   │   └── pages/
│   └── images/
│       └── clients/
├── includes/                   # Preparada; aún no se usa
├── database/
│   ├── schema.sql
│   └── install.ps1
└── backend/
    ├── api/
    ├── config/
    │   ├── config.example.php
    │   └── config.php          # Solo en el servidor; no versionar
    ├── lib/
    └── uploads/cv/
```

## 🔍 FLUJO DE AUTENTICACIÓN

```
USUARIO NUEVO:
1. Completa formulario de registro
2. Sistema crea usuario INACTIVO
3. Envía correo al ADMIN con link de activación
4. Admin hace click → activa cuenta
5. Usuario recibe correo de confirmación
6. Ahora puede hacer login

USUARIO EXISTENTE:
1. Ingresa email y contraseña
2. Sistema verifica que esté activo
3. Valida credenciales
4. Crea sesión PHP
5. Redirige a contenido exclusivo
```

## ⚠️ SOLUCIÓN DE PROBLEMAS

### Error al enviar correos:

- ✅ Verificar `MAIL_USERNAME` y `MAIL_PASSWORD` en `config.php`
- ✅ Para Gmail, usar contraseña de aplicación (no la contraseña normal)
- ✅ Verificar que el puerto 587 no esté bloqueado

### Error de base de datos:

- ✅ Verificar credenciales de PostgreSQL en `config.php`
- ✅ Verificar que existe la base de datos configurada

### Error al subir CV:

- ✅ Verificar permisos de escritura en `backend/uploads/cv/`
- ✅ Verificar en `php.ini`:
  ```
  upload_max_filesize = 10M
  post_max_size = 10M
  ```

### Sesión no funciona:

- ✅ Asegurarse de usar `http://localhost:8000` (no abrir directamente el archivo)
- ✅ Las sesiones solo funcionan en servidor, no desde file://

## 🎯 URLS IMPORTANTES

- **Login/Registro:** http://localhost:8000/HTML/login.html
- **Demo:** http://localhost:8000/HTML/demo.html
- **Empresa:** http://localhost:8000/HTML/empresa.html
- **Contenido Exclusivo:** http://localhost:8000/HTML/contenido_exclusivo.html

## 📧 CAMBIAR URL EN PRODUCCIÓN

Cuando subas a un servidor real, cambiar en `backend/config/config.php`:

```php
define('SITE_URL', 'https://tu-dominio.com');
```

Y también desactivar errores:

```php
error_reporting(0);
ini_set('display_errors', 0);
```

## ✨ ¡LISTO!

El sistema está completo y funcional. Solo necesitas:

1. ✅ Ejecutar el SQL de la base de datos
2. ✅ Configurar tu correo en `config.php`
3. ✅ Iniciar el servidor PHP
4. ✅ Probar los formularios

¡Todo funcionará automáticamente! 🎉
