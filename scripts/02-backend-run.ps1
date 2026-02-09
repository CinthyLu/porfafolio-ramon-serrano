# =====================================================
# 02-backend-run.ps1
# Compila y arranca el backend Spring Boot
# =====================================================
$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$BACKEND = Join-Path $ROOT "backend"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " ARRANCANDO BACKEND SPRING BOOT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Cargar .env si existe
$envFile = Join-Path $ROOT ".env"
if (Test-Path $envFile) {
    Write-Host "[INFO] Cargando variables de $envFile" -ForegroundColor White
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "  $name = $value" -ForegroundColor DarkGray
        }
    }
    Write-Host ""
}

# Verificar que el backend existe
if (-not (Test-Path (Join-Path $BACKEND "pom.xml"))) {
    Write-Host "[ERROR] No se encontro pom.xml en $BACKEND" -ForegroundColor Red
    exit 1
}

# Crear directorio de evidencias
$evidenceDir = Join-Path $ROOT "evidence\logs"
if (-not (Test-Path $evidenceDir)) {
    New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
}
$logFile = Join-Path $evidenceDir "backend-startup.log"

Write-Host "[INFO] Compilando backend (esto puede tardar la primera vez)..." -ForegroundColor Yellow
Write-Host "[INFO] Log: $logFile" -ForegroundColor White
Write-Host ""
Write-Host "  URLs disponibles al iniciar:" -ForegroundColor White
Write-Host "  - Health:  http://localhost:8080/api/health" -ForegroundColor Green
Write-Host "  - Swagger: http://localhost:8080/swagger-ui.html" -ForegroundColor Green
Write-Host "  - API Doc: http://localhost:8080/api-docs" -ForegroundColor Green
Write-Host ""
Write-Host "  Presiona Ctrl+C para detener el backend" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Ejecutar backend con mvn spring-boot:run
Set-Location $BACKEND
mvn spring-boot:run "-Dspring-boot.run.jvmArguments=-Dfile.encoding=UTF-8" 2>&1 | Tee-Object -FilePath $logFile
