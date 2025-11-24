# Script de instalación de base de datos para AsContSystem
# Ejecutar desde PowerShell

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Instalador de Base de Datos" -ForegroundColor Cyan
Write-Host "AsContSystem" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$DB_NAME = "pagina_web"
$DB_USER = "postgres"
$DB_PASS = "assoftware"
$SCHEMA_FILE = "schema.sql"

Write-Host "Configuración:" -ForegroundColor Yellow
Write-Host "Base de datos: $DB_NAME"
Write-Host "Usuario: $DB_USER"
Write-Host "Archivo: $SCHEMA_FILE"
Write-Host ""

# Verificar si existe psql
try {
    $psqlPath = Get-Command psql -ErrorAction Stop
    Write-Host "✓ PostgreSQL encontrado en: $($psqlPath.Source)" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: psql no encontrado en PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "1. Agregar PostgreSQL bin a PATH (ejemplo: C:\Program Files\PostgreSQL\9.3\bin)"
    Write-Host "2. O ejecutar manualmente:" -ForegroundColor Yellow
    Write-Host "   cd 'C:\Program Files\PostgreSQL\9.3\bin'" -ForegroundColor White
    Write-Host "   .\psql.exe -U postgres -d pagina_web -f '$PSScriptRoot\$SCHEMA_FILE'" -ForegroundColor White
    exit 1
}

# Verificar si existe el archivo schema.sql
if (-not (Test-Path $SCHEMA_FILE)) {
    Write-Host "✗ Error: No se encontró el archivo $SCHEMA_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Archivo $SCHEMA_FILE encontrado" -ForegroundColor Green
Write-Host ""

# Confirmar instalación
$confirmation = Read-Host "¿Desea continuar con la instalación? (S/N)"
if ($confirmation -ne 'S' -and $confirmation -ne 's') {
    Write-Host "Instalación cancelada" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Ejecutando instalación..." -ForegroundColor Cyan

# Ejecutar el script SQL
try {
    $env:PGPASSWORD = $DB_PASS
    psql -U $DB_USER -d $DB_NAME -f $SCHEMA_FILE
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==================================" -ForegroundColor Green
        Write-Host "✓ Instalación completada exitosamente" -ForegroundColor Green
        Write-Host "==================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Tablas creadas:" -ForegroundColor Yellow
        Write-Host "  - usuarios" -ForegroundColor White
        Write-Host "  - tokens_activacion" -ForegroundColor White
        Write-Host "  - sesiones" -ForegroundColor White
        Write-Host ""
        Write-Host "Próximos pasos:" -ForegroundColor Yellow
        Write-Host "1. Configurar correo en backend/config/config.php"
        Write-Host "2. Iniciar servidor PHP"
        Write-Host "3. Probar los formularios"
    } else {
        Write-Host ""
        Write-Host "✗ Error durante la instalación" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "✗ Error: $_" -ForegroundColor Red
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Read-Host "Presione Enter para salir"

