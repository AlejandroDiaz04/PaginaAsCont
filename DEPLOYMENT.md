# GUÍA DE DEPLOYMENT - ASCONT.COM.PY

## 📋 Archivos que DEBES subir al hosting (actualizados):

### JavaScript (rutas dinámicas local/producción):

1. ✅ `HTML/JS-HTML/login.js`
2. ✅ `JS/auth.js`
3. ✅ `HTML/demo.html`
4. ✅ `HTML/empresa.html`

### Backend PHP (con mejor manejo de errores):

5. ✅ `backend/api/solicitud_demo.php`
6. ✅ `backend/api/trabaja_con_nosotros.php`
7. ✅ `backend/api/test.php` (para diagnosticar problemas)

## 🔧 PASOS PARA CONFIGURAR EL HOSTING:

### Paso 1: Crear archivo config.php

En el hosting, crea o edita: `backend/config/config.php`

```php
<?php
// Configuración de Base de Datos
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'ascont_pagina_web');
define('DB_USER', 'ascont');
define('DB_PASS', 'AlexisZaracho341');

// Configuración de Correo
define('MAIL_HOST', 'smtp.gmail.com');
define('MAIL_PORT', 587);
define('MAIL_USERNAME', 'alejandrodiaz04zr@gmail.com');
define('MAIL_PASSWORD', 'lzdl pdor kdsd gxhp');
define('MAIL_FROM', 'alejandrodiaz04zr@gmail.com');
define('MAIL_FROM_NAME', 'AsContSystem');
define('MAIL_ENCRYPTION', 'tls');
define('MAIL_ADMIN', 'alejandrodiaz04zr@gmail.com');

// Configuración del Sitio
define('SITE_URL', 'https://ascont.com.py');
define('SITE_NAME', 'AsContSystem');

// Seguridad
define('SESSION_LIFETIME', 86400);
define('TOKEN_EXPIRATION', 172800);
?>
```

### Paso 2: Crear carpeta para CVs

En el hosting, crea la carpeta: `backend/uploads/cv/`
Asigna permisos 755 o 777

### Paso 3: Verificar archivos backend

Asegúrate de que existan:

- `backend/config/Mailer.php`
- `backend/config/Database.php`
- `backend/lib/PHPMailer.php`
- `backend/lib/SMTP.php`
- `backend/lib/Exception.php`

### Paso 4: Probar configuración

Visita: `https://ascont.com.py/backend/api/test.php`

Deberías ver un JSON con:

```json
{
  "config_loaded": true,
  "mailer_loaded": true,
  "uploads_writable": true
}
```

Si ves `false` en alguno, ese es tu problema.

## 🐛 ERRORES COMUNES Y SOLUCIONES:

### Error: "config_loaded: false"

- Verifica que `backend/config/config.php` exista
- Verifica las rutas relativas de `require_once`

### Error: "mailer_loaded: false"

- Verifica que `backend/config/Mailer.php` exista
- Verifica que `backend/lib/PHPMailer.php` exista

### Error: "uploads_writable: false"

- Crea la carpeta `backend/uploads/cv/`
- Cambia permisos: `chmod 755 backend/uploads/cv/`

### Error: "Login sigue usando localhost"

- Asegúrate de subir `HTML/JS-HTML/login.js` actualizado
- Limpia caché del navegador (Ctrl+Shift+R)

### Error 500 en formularios:

- Revisa `test.php` para ver qué falta
- Verifica que PostgreSQL esté instalado en el hosting
- Verifica las credenciales de base de datos

## ✅ LISTA DE VERIFICACIÓN:

- [ ] Subí todos los archivos JS actualizados
- [ ] Subí todos los archivos PHP actualizados
- [ ] Creé `backend/config/config.php` con credenciales del hosting
- [ ] Creé la carpeta `backend/uploads/cv/` con permisos
- [ ] Visité `test.php` y todo aparece en `true`
- [ ] Probé el login desde `https://ascont.com.py`
- [ ] Probé el formulario de demo
- [ ] Probé el formulario de trabajo

## 📞 SOPORTE:

Si después de seguir todos los pasos sigues teniendo errores:

1. Abre `https://ascont.com.py/backend/api/test.php`
2. Copia todo el JSON que aparece
3. Envíame ese JSON para diagnosticar el problema exacto
