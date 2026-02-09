# =====================================================
# 04-db-inspect.ps1
# Inspecciona la base de datos PostgreSQL (tablas y filas seed)
# =====================================================
$ErrorActionPreference = "Continue"
$ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " INSPECCION DE BASE DE DATOS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Crear directorio de evidencias
$evidenceDir = Join-Path $ROOT "evidence\db"
if (-not (Test-Path $evidenceDir)) {
    New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
}
$outputFile = Join-Path $evidenceDir "db-check.txt"

# Limpiar archivo previo
"" | Out-File -FilePath $outputFile -Encoding UTF8

function Run-SQL {
    param([string]$Description, [string]$Query)
    
    Write-Host "--- $Description ---" -ForegroundColor White
    $result = docker exec portfolio-postgres psql -U portfolio_user -d portfolio_db -c $Query 2>&1
    Write-Host $result
    Write-Host ""
    
    # Guardar en evidencia
    "=== $Description ===" | Out-File -FilePath $outputFile -Encoding UTF8 -Append
    $result | Out-File -FilePath $outputFile -Encoding UTF8 -Append
    "" | Out-File -FilePath $outputFile -Encoding UTF8 -Append
}

# 1. Listar todas las tablas
Run-SQL "Tablas en la base de datos" "\dt public.*"

# 2. Flyway schema history
Run-SQL "Historial de migraciones Flyway" "SELECT installed_rank, version, description, success FROM flyway_schema_history ORDER BY installed_rank;"

# 3. Contar registros por tabla
Run-SQL "Conteo: users" "SELECT role, COUNT(*) as total FROM users GROUP BY role;"
Run-SQL "Conteo: projects" "SELECT project_type, status, COUNT(*) as total FROM projects GROUP BY project_type, status;"
Run-SQL "Conteo: availability" "SELECT day_of_week, COUNT(*) as total FROM availability GROUP BY day_of_week ORDER BY day_of_week;"
Run-SQL "Conteo: advisories" "SELECT status, COUNT(*) as total FROM advisories GROUP BY status;"
Run-SQL "Conteo: notification_log" "SELECT type, status, COUNT(*) as total FROM notification_log GROUP BY type, status;"

# 4. Datos seed de usuarios
Run-SQL "Usuarios seed" "SELECT id, email, name, role, is_active FROM users ORDER BY role;"

# 5. Proyectos seed
Run-SQL "Proyectos seed" "SELECT title, project_type, status FROM projects ORDER BY title;"

# 6. Resumen total
Run-SQL "Resumen total de registros" "
SELECT 'users' as tabla, COUNT(*) as registros FROM users
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'availability', COUNT(*) FROM availability
UNION ALL SELECT 'advisories', COUNT(*) FROM advisories
UNION ALL SELECT 'notification_log', COUNT(*) FROM notification_log;
"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " INSPECCION COMPLETADA" -ForegroundColor Green
Write-Host " Evidencia guardada en: evidence\db\db-check.txt" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
