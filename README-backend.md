# Backend PHP - Manual de Instalación y Configuración

## 📋 Descripción

Este backend en PHP procesa los formularios de solicitud de demo y empleo del sitio AsContSystem. Incluye:

- ✅ Procesamiento de formularios con validación
- ✅ Integración con PostgreSQL (PDO)
- ✅ Protección Google reCAPTCHA v2
- ✅ Envío de emails de notificación
- ✅ Panel de administración con autenticación
- ✅ Manejo seguro de archivos (CV)

---

## 🔧 Requisitos del Servidor

### Requisitos Mínimos

- **PHP**: 7.4 o superior (recomendado 8.0+)
- **PostgreSQL**: 12 o superior
- **Extensiones PHP necesarias**:
  - `pdo`
  - `pdo_pgsql`
  - `mbstring`
  - `fileinfo`

### Verificar Extensiones PHP

```bash
php -m | grep -E "pdo|pdo_pgsql|mbstring|fileinfo"
```

Si falta alguna extensión, instalarla:

```bash
# En Ubuntu/Debian
sudo apt-get install php-pgsql php-mbstring

# En CentOS/RHEL
sudo yum install php-pgsql php-mbstring
```

---

## 📦 Instalación

### Paso 1: Configurar la Base de Datos PostgreSQL

1. **Conectarse a PostgreSQL**:

```bash
psql -U postgres -h localhost
```

2. **Ejecutar el script de inicialización**:

```sql
\i /ruta/completa/a/sql/init_postgres.sql
```

O alternativamente desde la línea de comandos:

```bash
psql -U postgres -h localhost -d postgres -f sql/init_postgres.sql
```

3. **Verificar que las tablas se crearon correctamente**:

```sql
\dt
```

Deberías ver:
- `solicitudes_demo`
- `solicitudes_empleo`
- `admin_users`
- `email_logs`

### Paso 2: Configurar el Archivo config.php

1. **Editar `/config.php`** y actualizar las siguientes configuraciones:

#### Credenciales de Base de Datos

```php
define('DB_HOST', 'localhost');        // ⚠️ Cambiar si es necesario
define('DB_PORT', '5432');
define('DB_NAME', 'postgres');         // ⚠️ Cambiar al nombre de tu BD
define('DB_USER', 'postgres');         // ⚠️ Cambiar tu usuario
define('DB_PASSWORD', 'asssoftware');  // ⚠️ CAMBIAR EN PRODUCCIÓN
```

#### Claves de Google reCAPTCHA v2

1. Obtener claves en: https://www.google.com/recaptcha/admin
2. Seleccionar **reCAPTCHA v2** → "Casilla de verificación 'No soy un robot'"
3. Agregar tu dominio
4. Copiar las claves:

```php
define('RECAPTCHA_SITE_KEY', 'TU_CLAVE_DE_SITIO_AQUI');
define('RECAPTCHA_SECRET_KEY', 'TU_CLAVE_SECRETA_AQUI');
```

#### Email del Administrador

```php
define('ADMIN_EMAIL_RECIPIENT', 'alejandrodiaz04zr@gmail.com');  // ⚠️ Cambiar
```

### Paso 3: Configurar Permisos de Directorios

```bash
# Crear directorios si no existen
mkdir -p uploads logs

# Establecer permisos
chmod 755 uploads
chmod 755 logs

# Si el servidor web necesita escribir (Apache/Nginx)
chown www-data:www-data uploads logs
chmod 775 uploads logs
```

### Paso 4: Subir Archivos al Servidor

Subir todos los archivos manteniendo la estructura:

```
/
├── config.php
├── README-backend.md
├── sql/
│   └── init_postgres.sql
├── php/
│   ├── submit_demo.php
│   ├── submit_empresa.php
│   ├── admin_login.php
│   ├── admin_panel.php
│   └── logout.php
├── uploads/        (creado automáticamente)
└── logs/           (creado automáticamente)
```

---

## 🔑 Credenciales de Administrador por Defecto

**⚠️ IMPORTANTE**: Cambiar después del primer login

```
Email: admin@ascont.com
Password: 341
```

### Cambiar Contraseña del Administrador

#### Opción 1: Desde línea de comandos

```bash
# Generar nuevo hash
php -r "echo password_hash('tu_nueva_contraseña', PASSWORD_DEFAULT);"

# Copiar el hash generado y actualizar en PostgreSQL
psql -U postgres -d postgres

UPDATE admin_users 
SET password_hash = '$2y$10$HASH_GENERADO_AQUI' 
WHERE email = 'admin@ascont.com';
```

#### Opción 2: Crear script de cambio de contraseña

Crear archivo `change_password.php`:

```php
<?php
require_once 'config.php';

$email = 'admin@ascont.com';
$newPassword = 'nueva_contraseña_segura';

$pdo = getDBConnection();
$hash = password_hash($newPassword, PASSWORD_DEFAULT);

$sql = "UPDATE admin_users SET password_hash = :hash WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute([':hash' => $hash, ':email' => $email]);

echo "Contraseña actualizada exitosamente\n";
```

Ejecutar:

```bash
php change_password.php
rm change_password.php  # Eliminar después de usar
```

---

## 🔐 Integrar reCAPTCHA en los Formularios HTML

### Formulario Demo (`HTML/demo.html`)

1. **Agregar script de reCAPTCHA** en el `<head>`:

```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

2. **Actualizar el formulario**:

```html
<form id="demoForm" method="POST" action="/php/submit_demo.php">
    <!-- Campos existentes -->
    <label for="select">Sistema para demo:</label>
    <select name="select" id="select" required>
        <option value="SistemaAsCont">Sistema AsCont</option>
        <option value="AplicacionAsCont">Aplicación AsCont</option>
        <option value="OtraOpcion">Sistema y Aplicacion AsCont</option>
    </select>

    <label for="name">Nombre Completo:</label>
    <input type="text" id="name" name="name" required minlength="3" maxlength="50">

    <label for="email">Correo Electrónico:</label>
    <input type="email" id="email" name="email" required>

    <label for="tel">Teléfono:</label>
    <input type="tel" id="tel" name="tel" pattern="[0-9+ ]+">

    <!-- Widget reCAPTCHA -->
    <div class="g-recaptcha" data-sitekey="TU_CLAVE_DE_SITIO_AQUI"></div>

    <button type="submit">Enviar Solicitud</button>
</form>

<script>
document.getElementById('demoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('/php/submit_demo.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            this.reset();
            grecaptcha.reset(); // Resetear reCAPTCHA
        } else {
            alert('Error: ' + (data.errors ? data.errors.join(', ') : data.message));
            grecaptcha.reset();
        }
    })
    .catch(error => {
        alert('Error al enviar el formulario');
        console.error(error);
    });
});
</script>
```

### Formulario Empleo (`HTML/empresa.html`)

1. **Agregar script de reCAPTCHA** en el `<head>`:

```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

2. **Actualizar el formulario**:

```html
<form id="empresaForm" method="POST" action="/php/submit_empresa.php" enctype="multipart/form-data">
    <h1>TRABAJA CON NOSOTROS</h1>

    <input type="text" name="nombre" placeholder="Nombre completo" required>
    <input type="email" name="correo" placeholder="Correo electrónico" required>
    <input type="tel" name="telefono" placeholder="Número de teléfono" required>

    <label class="adjunto-label">
        <span>Adjuntar CV</span>
        <input type="file" name="cv" accept=".pdf,.doc,.docx" required>
    </label>

    <textarea name="mensaje" placeholder="Cuéntanos por qué te gustaría unirte a nuestro equipo..." required></textarea>

    <!-- Widget reCAPTCHA -->
    <div class="g-recaptcha" data-sitekey="TU_CLAVE_DE_SITIO_AQUI"></div>

    <button type="submit">Enviar solicitud</button>
</form>

<script>
document.getElementById('empresaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('/php/submit_empresa.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            this.reset();
            grecaptcha.reset();
        } else {
            alert('Error: ' + (data.errors ? data.errors.join(', ') : data.message));
            grecaptcha.reset();
        }
    })
    .catch(error => {
        alert('Error al enviar el formulario');
        console.error(error);
    });
});
</script>
```

---

## 📧 Configuración de Envío de Emails

### Opción 1: Usar mail() de PHP (Por defecto)

La configuración por defecto usa la función `mail()` de PHP. Asegúrate de que tu servidor tenga configurado un MTA (Mail Transfer Agent) como **Postfix** o **Sendmail**.

**Verificar si mail() funciona**:

```php
<?php
$test = mail('tu@email.com', 'Test', 'Mensaje de prueba');
echo $test ? 'Email enviado' : 'Error al enviar';
?>
```

### Opción 2: Configurar SMTP con PHPMailer (Recomendado)

Si `mail()` no funciona o prefieres usar SMTP:

#### 1. Instalar PHPMailer

```bash
composer require phpmailer/phpmailer
```

#### 2. Actualizar config.php

```php
define('MAIL_USE_SMTP', true);
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'tu_email@gmail.com');
define('SMTP_PASSWORD', 'tu_contraseña_de_aplicacion');
define('SMTP_ENCRYPTION', 'tls');
```

**Nota para Gmail**: Necesitas generar una "Contraseña de aplicación":
1. Ir a https://myaccount.google.com/security
2. Activar verificación en 2 pasos
3. Generar contraseña de aplicación

#### 3. Crear función de envío SMTP

Agregar en `config.php`:

```php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendEmailSMTP($to, $subject, $htmlBody, $attachments = []) {
    $mail = new PHPMailer(true);
    
    try {
        // Configuración del servidor
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';
        
        // Remitente y destinatario
        $mail->setFrom(MAIL_FROM_EMAIL, MAIL_FROM_NAME);
        $mail->addAddress($to);
        
        // Contenido
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        
        // Adjuntos
        foreach ($attachments as $file) {
            if (file_exists($file)) {
                $mail->addAttachment($file);
            }
        }
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        logMessage("Error al enviar email SMTP: " . $mail->ErrorInfo);
        return false;
    }
}
```

#### 4. Actualizar scripts submit_demo.php y submit_empresa.php

Reemplazar la sección de envío de email:

```php
if (MAIL_USE_SMTP) {
    $emailSent = sendEmailSMTP(ADMIN_EMAIL_RECIPIENT, $emailSubject, $emailMessage);
} else {
    $emailSent = @mail(ADMIN_EMAIL_RECIPIENT, $emailSubject, $emailMessage, $emailHeaders);
}
```

---

## 🧪 Pruebas

### 1. Probar Conexión a Base de Datos

Crear archivo `test_db.php`:

```php
<?php
require_once 'config.php';

try {
    $pdo = getDBConnection();
    echo "✅ Conexión exitosa a PostgreSQL\n";
    
    $result = $pdo->query("SELECT COUNT(*) as total FROM admin_users");
    $count = $result->fetch();
    echo "👤 Usuarios admin: " . $count['total'] . "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
```

Ejecutar:

```bash
php test_db.php
```

### 2. Probar Envío de Formulario Demo

1. Ir a: `http://tu-dominio.com/HTML/demo.html`
2. Completar el formulario
3. Verificar que aparece mensaje de éxito
4. Revisar base de datos: `SELECT * FROM solicitudes_demo;`
5. Verificar email recibido

### 3. Probar Envío de Formulario Empleo

1. Ir a: `http://tu-dominio.com/HTML/empresa.html`
2. Completar el formulario con archivo CV
3. Verificar que aparece mensaje de éxito
4. Revisar base de datos: `SELECT * FROM solicitudes_empleo;`
5. Verificar que el CV se guardó en `/uploads/`

### 4. Probar Panel de Administración

1. Ir a: `http://tu-dominio.com/php/admin_login.php`
2. Login con credenciales: `admin@ascont.com` / `341`
3. Verificar que aparecen las solicitudes
4. Probar descarga de CV
5. Probar eliminación de registro
6. Probar logout

---

## 🔒 Seguridad

### Recomendaciones de Producción

1. **Cambiar credenciales por defecto**:
   - Contraseña del administrador
   - Contraseña de PostgreSQL
   - Claves reCAPTCHA reales

2. **Configurar HTTPS**:
   - Obtener certificado SSL (Let's Encrypt)
   - Forzar HTTPS en `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

3. **Proteger directorios sensibles**:

Crear archivo `/uploads/.htaccess`:

```apache
# Evitar acceso directo a archivos PHP
<FilesMatch "\.php$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
```

Crear archivo `/logs/.htaccess`:

```apache
Order Allow,Deny
Deny from all
```

4. **Configurar permisos restrictivos**:

```bash
chmod 644 config.php
chmod 644 php/*.php
chmod 700 sql/
```

5. **Limitar tamaño de archivos en php.ini**:

```ini
upload_max_filesize = 2M
post_max_size = 3M
```

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a PostgreSQL"

**Verificar**:
1. PostgreSQL está corriendo: `systemctl status postgresql`
2. Credenciales en `config.php` son correctas
3. PostgreSQL acepta conexiones: editar `pg_hba.conf`

```
# Agregar línea:
host    all    all    127.0.0.1/32    md5
```

Reiniciar PostgreSQL: `systemctl restart postgresql`

### Error: "Class 'PDO' not found"

**Solución**: Instalar extensión PDO:

```bash
sudo apt-get install php-pgsql
sudo systemctl restart apache2  # o php-fpm
```

### Emails no se envían

**Verificar**:
1. Logs en `/logs/mail_fallback.log`
2. Configuración de `mail()` del servidor
3. Alternativamente, usar SMTP (ver sección anterior)

### Archivos no se suben

**Verificar**:
1. Permisos del directorio `/uploads/`: debe ser escribible por el servidor web
2. Límites en `php.ini`: `upload_max_filesize` y `post_max_size`
3. Tamaño del archivo no excede 2MB

---

## 📝 Logs

Los logs se guardan en:

- **Errores generales**: `/logs/error.log`
- **Emails fallidos**: `/logs/mail_fallback.log`

Ver logs en tiempo real:

```bash
tail -f logs/error.log
tail -f logs/mail_fallback.log
```

---

## 🔄 Mantenimiento

### Backup de Base de Datos

```bash
# Backup completo
pg_dump -U postgres -h localhost postgres > backup_$(date +%Y%m%d).sql

# Backup solo de datos
pg_dump -U postgres -h localhost -a postgres > backup_data_$(date +%Y%m%d).sql
```

### Restaurar Backup

```bash
psql -U postgres -h localhost -d postgres < backup_20250118.sql
```

### Limpieza de Logs

Agregar a crontab para limpiar logs antiguos:

```bash
# Ejecutar cada mes
0 0 1 * * find /ruta/a/logs -type f -mtime +30 -delete
```

---

## 📞 Soporte

Para problemas o consultas:

- **Email**: alejandrodiaz04zr@gmail.com
- **Documentación PostgreSQL**: https://www.postgresql.org/docs/
- **Documentación PHP PDO**: https://www.php.net/manual/es/book.pdo.php
- **Google reCAPTCHA**: https://developers.google.com/recaptcha

---

## 📄 Licencia

© 2025 AsContSystem. Todos los derechos reservados.
