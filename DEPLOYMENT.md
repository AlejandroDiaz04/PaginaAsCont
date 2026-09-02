# Guía de deployment - ascont.com.py

El document root del hosting es la raíz del proyecto (sin carpeta `public/`).

## Configuración en el servidor

1. Copia `backend/config/config.example.php` como `backend/config/config.php`.
2. Completa en el servidor las credenciales de base de datos y correo. **No subas `config.php` al repositorio.**
3. Crea la carpeta `backend/uploads/cv/` con permisos de escritura (755).
4. Confirma que existan:
   - `backend/config/Mailer.php`
   - `backend/config/Database.php`
   - `backend/lib/PHPMailer.php`
   - `backend/lib/SMTP.php`
   - `backend/lib/Exception.php`

## Checklist

- [ ] `config.php` existe solo en el servidor, con credenciales del hosting
- [ ] `display_errors` está en `0`
- [ ] Carpeta `backend/uploads/cv/` creada y escribible
- [ ] Login desde la URL pública
- [ ] Formulario de demo
- [ ] Formulario "Trabaja con nosotros"
- [ ] Activación de cuenta por correo

## Errores frecuentes

**Login apunta a localhost**

- Sube el JavaScript de autenticación actualizado
- Limpia la caché del navegador (Ctrl+Shift+R)

**Error 500 en formularios**

- Revisa los logs de PHP/cPanel (no expongas endpoints de diagnóstico públicos)
- Verifica PostgreSQL y las credenciales en `config.php`

**No se pueden subir CVs**

- Permisos de `backend/uploads/cv/`
- `upload_max_filesize` y `post_max_size` en PHP
