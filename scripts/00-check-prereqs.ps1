# =====================================================
# 00-check-prereqs.ps1
# Verifica que todas las herramientas necesarias esten instaladas
# =====================================================
$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " VERIFICACION DE PREREQUISITOS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

function Test-Command($name, $cmd, $required) {
    try {
        $result = & $cmd 2>&1 | Select-Object -First 1
        Write-Host "[OK]  $name -> $result" -ForegroundColor Green
    } catch {
        if ($required) {
            Write-Host "[FAIL] $name NO encontrado (REQUERIDO)" -ForegroundColor Red
            $script:allOk = $false
        } else {
            Write-Host "[SKIP] $name NO encontrado (opcional)" -ForegroundColor Yellow
        }
    }
}

# Git
Write-Host "--- Herramientas de desarrollo ---" -ForegroundColor White
try {
    $gitV = git --version 2>&1
    Write-Host "[OK]  Git -> $gitV" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Git NO encontrado (REQUERIDO)" -ForegroundColor Red
    $allOk = $false
}

# Java
try {
    $javaV = java -version 2>&1 | Select-Object -First 1
    Write-Host "[OK]  Java -> $javaV" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Java NO encontrado (REQUERIDO - Java 17+)" -ForegroundColor Red
    $allOk = $false
}

# Maven
try {
    $mvnV = mvn --version 2>&1 | Select-Object -First 1
    Write-Host "[OK]  Maven -> $mvnV" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Maven NO encontrado (REQUERIDO)" -ForegroundColor Red
    Write-Host "       Instalar: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    Write-Host "       O: choco install maven / scoop install maven" -ForegroundColor Yellow
    $allOk = $false
}

# Docker
Write-Host ""
Write-Host "--- Docker ---" -ForegroundColor White
try {
    $dockerV = docker --version 2>&1
    Write-Host "[OK]  Docker -> $dockerV" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Docker NO encontrado (REQUERIDO)" -ForegroundColor Red
    Write-Host "       Instalar: https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Yellow
    $allOk = $false
}

# Docker Compose
try {
    $composeV = docker compose version 2>&1
    Write-Host "[OK]  Docker Compose -> $composeV" -ForegroundColor Green
} catch {
    try {
        $composeV = docker-compose --version 2>&1
        Write-Host "[OK]  Docker Compose (legacy) -> $composeV" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Docker Compose NO encontrado (REQUERIDO)" -ForegroundColor Red
        $allOk = $false
    }
}

# Docker daemon running?
try {
    $dockerInfo = docker info 2>&1 | Select-String "Server Version"
    if ($dockerInfo) {
        Write-Host "[OK]  Docker daemon corriendo -> $dockerInfo" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Docker instalado pero el daemon NO esta corriendo" -ForegroundColor Yellow
        Write-Host "       Abre Docker Desktop y espera a que inicie" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARN] No se pudo verificar el daemon de Docker" -ForegroundColor Yellow
}

# Node (opcional)
Write-Host ""
Write-Host "--- Opcional (frontend) ---" -ForegroundColor White
try {
    $nodeV = node --version 2>&1
    Write-Host "[OK]  Node.js -> $nodeV" -ForegroundColor Green
} catch {
    Write-Host "[SKIP] Node.js NO encontrado (necesario solo para frontend)" -ForegroundColor Yellow
}

# Resumen
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
if ($allOk) {
    Write-Host " RESULTADO: TODOS LOS PREREQUISITOS OK" -ForegroundColor Green
    Write-Host " Puedes continuar con: .\scripts\01-db-up.ps1" -ForegroundColor Green
} else {
    Write-Host " RESULTADO: FALTAN PREREQUISITOS" -ForegroundColor Red
    Write-Host " Instala las herramientas marcadas [FAIL]" -ForegroundColor Red
    Write-Host " y vuelve a ejecutar este script." -ForegroundColor Red
}
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
