# Configuración de Correo Electrónico

## Estado Actual

✅ El sistema funciona correctamente (registro, login, formularios)
⚠️ Los correos no se envían porque la función `mail()` de PHP en Windows requiere configuración adicional

## Soluciones

### Opción 1: Activar usuarios manualmente (Temporal)

Mientras configuras el correo, puedes activar usuarios directamente en la base de datos:

```sql
-- Ver usuarios pendientes de activación
SELECT id, nombre, email, activo FROM usuarios WHERE activo = false;

-- Activar un usuario específico
UPDATE usuarios SET activo = true, fecha_activacion = CURRENT_TIMESTAMP
WHERE email = 'email@ejemplo.com';

-- Ver link de activación de un usuario
SELECT
    u.nombre,
    u.email,
    'http://localhost:8000/backend/api/activar_cuenta.php?token=' || ta.token as link_activacion
FROM usuarios u
INNER JOIN tokens_activacion ta ON u.id = ta.usuario_id
WHERE u.email = 'email@ejemplo.com' AND ta.usado = false;
```

### Opción 2: Instalar y Configurar PHPMailer (Recomendado)

1. Descargar PHPMailer:

```powershell
cd backend
# Descargar desde: https://github.com/PHPMailer/PHPMailer/archive/refs/heads/master.zip
# Extraer en backend/phpmailer/
```

2. Actualizar `Mailer.php` para usar PHPMailer (código más abajo)

### Opción 3: Usar SMTP Relay Local

Instalar un servidor SMTP local como:

- **hMailServer** (gratuito): https://www.hmailserver.com/
- **Papercut SMTP** (solo para desarrollo): https://github.com/ChangemakerStudios/Papercut-SMTP

### Opción 4: Configurar XAMPP Mercury (más complejo)

XAMPP incluye Mercury Mail, pero su configuración es compleja.

## Configuración Actual

Tu sistema está configurado para:

- **SMTP Host:** smtp.gmail.com
- **Puerto:** 587
- **Email:** alejandrodiaz04zr@gmail.com
- **Destinatario:** alejandrodiaz04zr@gmail.com

## Notas Importantes

1. La función `mail()` de PHP en Windows **NO soporta autenticación SMTP** moderna
2. Gmail requiere:

   - Verificación en 2 pasos activada
   - Contraseña de aplicación (no la contraseña normal)
   - Conexión segura TLS/SSL

3. Por eso `mail()` no funciona con Gmail en Windows sin configuración adicional

## Mientras tanto

El sistema funciona perfectamente para:

- ✅ Registro de usuarios (se guardan en BD)
- ✅ Login (con usuarios activos)
- ✅ Formularios (se guardan/procesan correctamente)
- ✅ Sesiones y contenido exclusivo

Solo no se envían los correos de notificación, pero puedes:

1. Activar usuarios manualmente en la BD
2. Ver los links de activación en los logs del servidor PHP
3. Usar el link que aparece en la respuesta JSON (visible en consola del navegador)

## Link de Activación Manual

Cuando registras un usuario, el sistema genera un link de activación. Puedes verlo:

1. En la consola del navegador (Developer Tools → Console)
2. En los logs del servidor PHP
3. O consultando la base de datos:

```sql
SELECT
    'http://localhost:8000/backend/api/activar_cuenta.php?token=' || token as link
FROM tokens_activacion
WHERE usado = false
ORDER BY fecha_creacion DESC
LIMIT 1;
```

Copia ese link y ábrelo en el navegador para activar la cuenta.
