# README Backend - Sistema de Formularios AsCont

Este documento contiene las instrucciones completas para configurar y desplegar el backend PHP del sistema de formularios de AsCont Systems.

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Configuración de reCAPTCHA](#configuración-de-recaptcha)
5. [Configuración de Email](#configuración-de-email)
6. [Despliegue en Hosting](#despliegue-en-hosting)
7. [Uso del Panel Administrativo](#uso-del-panel-administrativo)
8. [Solución de Problemas](#solución-de-problemas)
9. [Seguridad](#seguridad)

---

## 🔧 Requisitos del Sistema

### Requisitos Mínimos del Servidor

- **PHP**: 7.4 o superior (recomendado PHP 8.0+)
- **PostgreSQL**: 10.0 o superior
- **Extensiones PHP requeridas**:
  - `pdo_pgsql` (PDO PostgreSQL Driver)
  - `mbstring`
  - `fileinfo`
  - `session`

### Verificar Requisitos

Para verificar que su servidor cumple con los requisitos, cree un archivo `phpinfo.php`:

```php
<?php phpinfo(); ?>
```

Suba este archivo a su servidor y acceda vía navegador. Busque:
- Versión de PHP
- Extensión `pdo_pgsql` en la lista de extensiones habilitadas
- Configuración de `upload_max_filesize` (debe ser al menos 2MB)

**IMPORTANTE**: Elimine el archivo `phpinfo.php` después de verificar por seguridad.

---

## 🚀 Instalación y Configuración

### Paso 1: Subir Archivos al Servidor

Suba todos los archivos del repositorio a su servidor web mediante FTP, SFTP, o el panel de control de su hosting.

Estructura de archivos:

```
/
├── config.php
├── index.html
├── php/
│   ├── submit_demo.php
│   ├── submit_empresa.php
│   ├── admin_login.php
│   ├── admin_panel.php
│   ├── logout.php
│   └── success.php
├── sql/
│   └── init_postgres.sql
├── uploads/        (se crea automáticamente)
├── logs/          (se crea automáticamente)
├── HTML/
├── CSS/
├── JS/
└── README-backend.md
```

### Paso 2: Configurar Permisos

Establezca los siguientes permisos:

```bash
chmod 755 php/
chmod 644 php/*.php
chmod 755 uploads/
chmod 755 logs/
chmod 644 config.php
```

---

## 💾 Configuración de Base de Datos

### Paso 1: Crear la Base de Datos (si es necesario)

Si su hosting requiere que cree una base de datos específica:

```sql
CREATE DATABASE ascont_db;
```

O use el panel de control de su hosting (cPanel, Plesk, etc.) para crear la base de datos.

### Paso 2: Ejecutar el Script de Inicialización

**Opción A: Usando línea de comandos**

```bash
psql -U postgres -d postgres -f sql/init_postgres.sql
```

**Opción B: Usando pgAdmin**

1. Abra pgAdmin
2. Conéctese a su servidor PostgreSQL
3. Seleccione la base de datos (postgres o la que creó)
4. Vaya a Tools → Query Tool
5. Abra el archivo `sql/init_postgres.sql`
6. Ejecute el script (F5)

**Opción C: Usando panel del hosting**

Si su hosting provee phpPgAdmin u otra interfaz web:

1. Acceda a la interfaz
2. Seleccione su base de datos
3. Busque la opción "SQL" o "Ejecutar SQL"
4. Copie y pegue el contenido de `sql/init_postgres.sql`
5. Ejecute

### Paso 3: Configurar Credenciales en config.php

Edite el archivo `config.php` y actualice las siguientes líneas con sus credenciales:

```php
// CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL
define('DB_HOST', 'localhost');        // Cambiar si es necesario
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');         // Cambiar al nombre de su BD
define('DB_USER', 'postgres');         // Cambiar al usuario de su BD
define('DB_PASSWORD', 'asssoftware');  // CAMBIAR A SU CONTRASEÑA
```

### Paso 4: Verificar Conexión

Cree un archivo temporal `test_db.php` en la raíz:

```php
<?php
require_once 'config.php';
try {
    $pdo = getDBConnection();
    echo "✓ Conexión exitosa a la base de datos!";
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage();
}
?>
```

Acceda al archivo vía navegador y verifique la conexión. **Elimínelo después de probar**.

---

## 🔐 Configuración de reCAPTCHA

### Paso 1: Obtener Claves de reCAPTCHA v2

1. Visite [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Inicie sesión con su cuenta de Google
3. Haga clic en el botón "+" para registrar un nuevo sitio
4. Complete el formulario:
   - **Etiqueta**: AsCont Systems
   - **Tipo de reCAPTCHA**: reCAPTCHA v2 → "No soy un robot"
   - **Dominios**: Agregue su dominio (ej: `ascont.com`)
   - Acepte los términos de servicio
5. Haga clic en "Enviar"
6. Copie las claves generadas:
   - **Clave del sitio** (Site Key)
   - **Clave secreta** (Secret Key)

### Paso 2: Configurar Claves en config.php

Edite `config.php`:

```php
// GOOGLE reCAPTCHA v2 CONFIGURATION
define('RECAPTCHA_SITE_KEY', 'SU_CLAVE_DEL_SITIO_AQUI');
define('RECAPTCHA_SECRET_KEY', 'SU_CLAVE_SECRETA_AQUI');
```

### Paso 3: Agregar reCAPTCHA a los Formularios HTML

**Para /HTML/demo.html**, dentro del `<form>`:

```html
<!-- Agregar antes del botón de submit -->
<div class="g-recaptcha" data-sitekey="SU_CLAVE_DEL_SITIO_AQUI"></div>

<!-- Agregar al final del body, antes de cerrar </body> -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

También actualice la acción del formulario:

```html
<form action="/php/submit_demo.php" method="POST">
```

**Para /HTML/empresa.html**, en el formulario de empleo:

```html
<form action="/php/submit_empresa.php" method="POST" enctype="multipart/form-data">
    <!-- campos existentes... -->
    
    <!-- Agregar antes del botón de submit -->
    <div class="g-recaptcha" data-sitekey="SU_CLAVE_DEL_SITIO_AQUI"></div>
    
    <button type="submit">Enviar solicitud</button>
</form>

<!-- Agregar al final del body, antes de cerrar </body> -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

---

## 📧 Configuración de Email

### Configuración Temporal (Actual)

El sistema está configurado temporalmente para enviar emails a:

```php
define('ADMIN_EMAIL_RECIPIENT', 'alejandrodiaz04zr@gmail.com');
```

### Cambiar a Email de Producción

**IMPORTANTE**: Antes de desplegar en producción, cambie este email en `config.php`:

```php
// Cambiar a su email corporativo
define('ADMIN_EMAIL_RECIPIENT', 'gerencia@ascont.com');
// O
define('ADMIN_EMAIL_RECIPIENT', 'admin@ascont.com');
```

### Verificar Función mail()

Cree un archivo temporal `test_email.php`:

```php
<?php
$to = "su_email@ejemplo.com";
$subject = "Test Email - AsCont";
$message = "Este es un email de prueba.";
$headers = "From: noreply@ascont.com";

if (mail($to, $subject, $message, $headers)) {
    echo "Email enviado exitosamente";
} else {
    echo "Error al enviar email";
}
?>
```

Si `mail()` **NO funciona**, continúe a la siguiente sección.

### Configurar PHPMailer/SMTP (Si mail() no funciona)

Si la función `mail()` no está disponible o no funciona en su hosting:

#### 1. Instalar PHPMailer

```bash
composer require phpmailer/phpmailer
```

O descargue manualmente desde: https://github.com/PHPMailer/PHPMailer

#### 2. Crear archivo php/emailer.php

```php
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // O la ruta donde instaló PHPMailer

function enviarEmailSMTP($to, $subject, $body, $attachments = []) {
    $mail = new PHPMailer(true);
    
    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';  // Cambiar según su proveedor
        $mail->SMTPAuth   = true;
        $mail->Username   = 'su_email@gmail.com'; // Su email
        $mail->Password   = 'su_contraseña_app';  // Contraseña de aplicación
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
        
        // Remitente y destinatario
        $mail->setFrom('noreply@ascont.com', 'AsCont Systems');
        $mail->addAddress($to);
        
        // Contenido
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        
        // Adjuntos
        foreach ($attachments as $attachment) {
            $mail->addAttachment($attachment);
        }
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Error PHPMailer: {$mail->ErrorInfo}");
        return false;
    }
}
?>
```

#### 3. Modificar submit_demo.php y submit_empresa.php

Reemplace la llamada a `mail()` con:

```php
require_once __DIR__ . '/emailer.php';
$emailSent = enviarEmailSMTP(ADMIN_EMAIL_RECIPIENT, $asunto, $mensaje);
```

#### 4. Configurar Contraseña de Aplicación (Gmail)

Si usa Gmail:

1. Vaya a https://myaccount.google.com/security
2. Active "Verificación en 2 pasos"
3. Vaya a "Contraseñas de aplicaciones"
4. Genere una contraseña para "Correo"
5. Use esta contraseña en el código

---

## 🌐 Despliegue en Hosting

### Verificaciones Previas al Despliegue

- [ ] Base de datos creada y script SQL ejecutado
- [ ] Credenciales de BD actualizadas en `config.php`
- [ ] Claves de reCAPTCHA configuradas
- [ ] Email destinatario actualizado a email de producción
- [ ] Permisos de carpetas configurados correctamente
- [ ] Función `mail()` probada o PHPMailer configurado

### Configuración de .htaccess (Opcional, para Apache)

Cree un archivo `.htaccess` en la raíz para mejorar la seguridad:

```apache
# Prevenir acceso directo a archivos sensibles
<FilesMatch "^(config\.php|composer\.(json|lock))$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Proteger carpeta logs
<Directory "logs">
    Order Allow,Deny
    Deny from all
</Directory>

# Habilitar compresión
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Headers de seguridad
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Verificación Post-Despliegue

1. **Test de formulario demo**:
   - Visite `/HTML/demo.html`
   - Complete y envíe el formulario
   - Verifique que llegue el email
   - Verifique que aparezca en el panel admin

2. **Test de formulario empleo**:
   - Visite `/HTML/empresa.html#trabajaConNosotros`
   - Complete el formulario y suba un CV
   - Verifique email con adjunto
   - Verifique en panel admin

3. **Test de panel administrativo**:
   - Acceda a `/php/admin_login.php`
   - Login con: `admin@ascont.com` / `341`
   - Verifique que vea las solicitudes
   - Intente descargar un CV

---

## 👤 Uso del Panel Administrativo

### Acceso Inicial

- **URL**: `https://sudominio.com/php/admin_login.php`
- **Email**: `admin@ascont.com`
- **Contraseña**: `341`

**⚠️ IMPORTANTE**: Cambie la contraseña inmediatamente después del primer login.

### Cambiar Contraseña del Administrador

1. Genere el hash de su nueva contraseña:

```php
<?php
echo password_hash('su_nueva_contraseña_segura', PASSWORD_DEFAULT);
?>
```

2. Ejecute en PostgreSQL:

```sql
UPDATE admin_users 
SET password_hash = '$2y$10$[HASH_GENERADO]' 
WHERE email = 'admin@ascont.com';
```

### Crear Usuarios Adicionales

```sql
INSERT INTO admin_users (email, password_hash, nombre, rol)
VALUES (
    'usuario@ascont.com',
    '$2y$10$[HASH_PASSWORD]',
    'Nombre Usuario',
    'usuario_premium'  -- o 'admin'
);
```

### Roles de Usuario

- **admin**: Acceso completo (ver, eliminar, descargar)
- **usuario_premium**: Acceso completo (mismo que admin en esta versión)

---

## 🔍 Solución de Problemas

### Error: "Error de conexión a la base de datos"

**Causa**: Credenciales incorrectas o PostgreSQL no disponible

**Solución**:
1. Verifique credenciales en `config.php`
2. Verifique que PostgreSQL esté corriendo
3. Verifique que la extensión `pdo_pgsql` esté instalada
4. Contacte a su proveedor de hosting para verificar soporte PostgreSQL

### Error: "Por favor, complete la verificación reCAPTCHA"

**Causa**: reCAPTCHA no configurado o claves incorrectas

**Solución**:
1. Verifique que agregó el script de reCAPTCHA al HTML
2. Verifique que las claves en `config.php` sean correctas
3. Verifique que el dominio esté registrado en Google reCAPTCHA

### Error: Archivo CV no se sube

**Causa**: Permisos incorrectos o tamaño excedido

**Solución**:
1. Verifique permisos de carpeta `uploads/` (debe ser 755)
2. Verifique que el archivo sea menor a 2MB
3. Verifique que el formato sea PDF, DOC o DOCX
4. Verifique configuración PHP:
   ```ini
   upload_max_filesize = 2M
   post_max_size = 3M
   ```

### Error: Email no se envía

**Causa**: Función `mail()` no disponible

**Solución**:
1. Revise el archivo `logs/mail_fallback.log`
2. Configure PHPMailer/SMTP (ver sección de Email)
3. Contacte a su proveedor de hosting para habilitar `mail()`

### Error 500 en páginas PHP

**Causa**: Error de sintaxis PHP o configuración incorrecta

**Solución**:
1. Revise `logs/errors.log`
2. Habilite display_errors temporalmente:
   ```php
   ini_set('display_errors', 1);
   error_reporting(E_ALL);
   ```
3. Verifique versión de PHP (mínimo 7.4)

---

## 🔒 Seguridad

### Recomendaciones de Seguridad

1. **Cambiar contraseña del admin inmediatamente**
2. **Usar contraseñas fuertes** (mínimo 12 caracteres, con mayúsculas, minúsculas, números y símbolos)
3. **Actualizar email destinatario** de temporal a producción
4. **Proteger config.php**:
   ```apache
   <Files "config.php">
       Order Allow,Deny
       Deny from all
   </Files>
   ```
5. **Hacer backups regulares** de la base de datos:
   ```bash
   pg_dump -U postgres -d postgres > backup_$(date +%Y%m%d).sql
   ```
6. **Monitorear logs** regularmente:
   - `logs/errors.log`
   - `logs/security.log`
   - `logs/mail_fallback.log`

### Actualizar PostgreSQL Regularmente

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade postgresql

# Verificar versión
psql --version
```

### Limitar Acceso al Panel Admin

Considere agregar autenticación adicional a nivel de servidor (HTTP Auth) para `/php/admin_*.php`.

---

## 📞 Soporte

Si tiene problemas durante la instalación o configuración:

1. Revise los logs en la carpeta `logs/`
2. Verifique que cumple todos los requisitos del sistema
3. Consulte la sección de Solución de Problemas
4. Contacte al equipo de desarrollo de AsCont Systems

---

## 📝 Checklist de Despliegue Final

Antes de considerar el despliegue completo:

- [ ] Base de datos PostgreSQL configurada y tablas creadas
- [ ] Credenciales de BD actualizadas en `config.php`
- [ ] Contraseña del admin cambiada de '341' a una segura
- [ ] Email destinatario cambiado a email de producción
- [ ] reCAPTCHA v2 configurado y probado
- [ ] Formularios HTML actualizados con action y reCAPTCHA
- [ ] Función de email probada (mail() o PHPMailer)
- [ ] Permisos de archivos y carpetas configurados
- [ ] Panel admin accesible y funcional
- [ ] Subida de archivos CV probada
- [ ] Emails de notificación llegando correctamente
- [ ] .htaccess configurado (si usa Apache)
- [ ] Backups de BD configurados
- [ ] Documentación revisada

---

## 🎉 ¡Felicidades!

Si completó todos los pasos, su backend PHP está listo para producción. El sistema ahora puede:

✅ Procesar solicitudes de demo  
✅ Procesar solicitudes de empleo con CV  
✅ Proteger formularios con reCAPTCHA v2  
✅ Enviar notificaciones por email  
✅ Gestionar solicitudes desde panel admin  
✅ Almacenar datos de forma segura en PostgreSQL  

---

**Documento creado**: 2025  
**Versión**: 1.0  
**AsCont Systems** - Transformación Digital
