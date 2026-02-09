# =====================================================
# 01-db-up.ps1
# Levanta PostgreSQL con Docker Compose y espera al healthcheck
# =====================================================
$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " LEVANTANDO POSTGRESQL CON DOCKER" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Buscar docker-compose.yml
$composeFile = Join-Path $ROOT "database\docker-compose.yml"
if (-not (Test-Path $composeFile)) {
    Write-Host "[ERROR] No se encontro $composeFile" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Usando: $composeFile" -ForegroundColor White

# Levantar containers
Write-Host "[INFO] Ejecutando docker compose up -d ..." -ForegroundColor White
try {
    docker compose -f $composeFile up -d 2>&1
} catch {
    # Fallback a docker-compose legacy
    docker-compose -f $composeFile up -d 2>&1
}

# Esperar a que Postgres este listo (healthcheck)
Write-Host ""
Write-Host "[INFO] Esperando a que PostgreSQL este listo..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    try {
        $health = docker inspect --format='{{.State.Health.Status}}' portfolio-postgres 2>&1
        if ($health -match "healthy") {
            Write-Host ""
            Write-Host "[OK] PostgreSQL esta listo! (intento $attempt)" -ForegroundColor Green
            break
        }
        Write-Host "  Intento $attempt/$maxAttempts - Estado: $health" -ForegroundColor Yellow
    } catch {
        Write-Host "  Intento $attempt/$maxAttempts - Esperando container..." -ForegroundColor Yellow
    }
    Start-Sleep -Seconds 2
}

if ($attempt -ge $maxAttempts) {
    Write-Host "[ERROR] PostgreSQL no inicio a tiempo" -ForegroundColor Red
    Write-Host "  Revisa: docker logs portfolio-postgres" -ForegroundColor Yellow
    exit 1
}

# Verificar conectividad
Write-Host ""
Write-Host "[INFO] Verificando conectividad..." -ForegroundColor White
$testResult = docker exec portfolio-postgres psql -U portfolio_user -d portfolio_db -c "SELECT 1 as test;" 2>&1
Write-Host $testResult
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " POSTGRES LISTO EN localhost:5432" -ForegroundColor Green
Write-Host " DB: portfolio_db" -ForegroundColor Green
Write-Host " User: portfolio_user" -ForegroundColor Green
Write-Host " Pass: portfolio_pass" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Siguiente paso: .\scripts\02-backend-run.ps1" -ForegroundColor White
Write-Host ""
