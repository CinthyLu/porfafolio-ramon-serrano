# =====================================================
# 03-smoke-tests.ps1
# Pruebas de humo contra el backend corriendo
# =====================================================
$ErrorActionPreference = "Continue"
$ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$BASE_URL = "http://localhost:8080"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " SMOKE TESTS - Backend API" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Crear directorio de evidencias
$evidenceDir = Join-Path $ROOT "evidence\smoke"
if (-not (Test-Path $evidenceDir)) {
    New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
}

$results = @()
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedStatusCode = "200",
        [string]$ExpectedContent = "",
        [bool]$IsJson = $true
    )

    $result = @{
        name = $Name
        url = $Url
        status = "FAIL"
        statusCode = 0
        responseTime = 0
        detail = ""
    }

    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $stopwatch.Stop()

        $result.statusCode = $response.StatusCode
        $result.responseTime = $stopwatch.ElapsedMilliseconds

        if ($response.StatusCode -eq [int]$ExpectedStatusCode) {
            if ($ExpectedContent -and $response.Content -notmatch $ExpectedContent) {
                $result.status = "FAIL"
                $result.detail = "Contenido no contiene '$ExpectedContent'"
                Write-Host "[FAIL] $Name" -ForegroundColor Red
                Write-Host "       Esperaba contenido: $ExpectedContent" -ForegroundColor Red
                $script:failed++
            } else {
                $result.status = "PASS"
                $result.detail = "OK ($($stopwatch.ElapsedMilliseconds)ms)"
                Write-Host "[PASS] $Name -> $($response.StatusCode) ($($stopwatch.ElapsedMilliseconds)ms)" -ForegroundColor Green
                $script:passed++
            }
        } else {
            $result.status = "FAIL"
            $result.detail = "Status $($response.StatusCode) != $ExpectedStatusCode"
            Write-Host "[FAIL] $Name -> Status $($response.StatusCode)" -ForegroundColor Red
            $script:failed++
        }

        # Guardar respuesta individual
        if ($IsJson) {
            $safeName = $Name -replace '[^a-zA-Z0-9]', '_'
            $response.Content | Out-File -FilePath (Join-Path $evidenceDir "$safeName.json") -Encoding UTF8
        }

    } catch {
        $result.detail = $_.Exception.Message
        Write-Host "[FAIL] $Name -> $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
    }

    $script:results += $result
}

# ===== TESTS =====

Write-Host "--- Endpoints Publicos ---" -ForegroundColor White
Write-Host ""

# 1. Health Check
Test-Endpoint -Name "Health Check" -Url "$BASE_URL/api/health" -ExpectedContent "UP"

# 2. Swagger UI HTML
Test-Endpoint -Name "Swagger UI" -Url "$BASE_URL/swagger-ui/index.html" -ExpectedContent "swagger" -IsJson $false

# 3. API Docs JSON
Test-Endpoint -Name "OpenAPI Docs" -Url "$BASE_URL/api-docs" -ExpectedContent "openapi"

# 4. Public Programmers List
Test-Endpoint -Name "Public Programmers" -Url "$BASE_URL/api/public/programmers" -ExpectedContent "content"

# 5. Public Programmer Portfolio
Test-Endpoint -Name "Programmer Portfolio" -Url "$BASE_URL/api/public/programmers/22222222-2222-2222-2222-222222222222/portfolio" -ExpectedContent "programmer"

# ===== RESUMEN =====

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " RESULTADOS SMOKE TESTS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Pasados: $passed" -ForegroundColor Green
Write-Host "  Fallidos: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "  Total:   $($passed + $failed)" -ForegroundColor White
Write-Host ""

# Guardar resultados JSON
$summaryJson = @{
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
    passed = $passed
    failed = $failed
    total = $passed + $failed
    tests = $results
} | ConvertTo-Json -Depth 3

$summaryJson | Out-File -FilePath (Join-Path $evidenceDir "smoke-results.json") -Encoding UTF8

Write-Host "[INFO] Resultados guardados en: evidence\smoke\smoke-results.json" -ForegroundColor White
Write-Host ""

if ($failed -gt 0) {
    Write-Host " ALGUNOS TESTS FALLARON" -ForegroundColor Red
    Write-Host " Asegurate que el backend esta corriendo (02-backend-run.ps1)" -ForegroundColor Yellow
} else {
    Write-Host " TODOS LOS TESTS PASARON!" -ForegroundColor Green
    Write-Host " Siguiente: .\scripts\04-db-inspect.ps1" -ForegroundColor White
}
Write-Host ""
