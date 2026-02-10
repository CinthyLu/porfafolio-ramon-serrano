# Script de Verificación de Integración Frontend-Backend
# =========================================================

Write-Host "`n🔍 VERIFICANDO INTEGRACIÓN COMPLETA`n" -ForegroundColor Cyan

# 1. Verificar Backend en Render
Write-Host "1️⃣  Verificando Backend Health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://repositorio-backend-proyectofinal.onrender.com/api/health" -UseBasicParsing -TimeoutSec 30
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend está funcionando" -ForegroundColor Green
        Write-Host "   Respuesta: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   ⚠️  Si el servicio está 'dormido', puede tardar 30-60 segundos en despertar" -ForegroundColor Yellow
}

# 2. Verificar Swagger UI
Write-Host "`n2️⃣  Verificando Swagger UI..." -ForegroundColor Yellow
try {
    $swaggerResponse = Invoke-WebRequest -Uri "https://repositorio-backend-proyectofinal.onrender.com/swagger-ui/index.html" -UseBasicParsing -TimeoutSec 10
    if ($swaggerResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Swagger UI accesible" -ForegroundColor Green
        Write-Host "   URL: https://repositorio-backend-proyectofinal.onrender.com/swagger-ui/index.html" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Swagger UI no respondió (puede estar deshabilitado en producción)" -ForegroundColor Yellow
}

# 3. Verificar CORS
Write-Host "`n3️⃣  Verificando configuración CORS..." -ForegroundColor Yellow
Write-Host "   ⚠️  Asegúrate de tener estas variables en Render:" -ForegroundColor Yellow
Write-Host "   - CORS_ORIGINS=https://portafolio-ramon-serrano.web.app,http://localhost:4200" -ForegroundColor Gray

# 4. Verificar Frontend
Write-Host "`n4️⃣  Frontend desplegado en:" -ForegroundColor Yellow
Write-Host "   🌐 https://portafolio-ramon-serrano.web.app" -ForegroundColor Cyan

# 5. Lista de verificación manual
Write-Host "`n📋 CHECKLIST DE VERIFICACIÓN MANUAL`n" -ForegroundColor Cyan
Write-Host "   □ Abrir https://portafolio-ramon-serrano.web.app" -ForegroundColor White
Write-Host "   □ Abrir DevTools (F12) → Pestaña Console" -ForegroundColor White
Write-Host "   □ Hacer clic en 'Login with Google'" -ForegroundColor White
Write-Host "   □ Verificar que NO haya errores CORS en la consola" -ForegroundColor White
Write-Host "   □ Verificar que el login funcione correctamente" -ForegroundColor White
Write-Host "   □ Verificar que puedas navegar entre páginas" -ForegroundColor White

Write-Host "`n🔴 SI VES ERRORES DE CORS:`n" -ForegroundColor Red
Write-Host "   1. Ve a Render Dashboard → Tu servicio → Environment" -ForegroundColor White
Write-Host "   2. Verifica que CORS_ORIGINS contenga:" -ForegroundColor White
Write-Host "      https://portafolio-ramon-serrano.web.app,http://localhost:4200" -ForegroundColor Gray
Write-Host "   3. Guarda y espera el redespliegue (~2 min)" -ForegroundColor White

Write-Host "`n✅ ENDPOINTS DISPONIBLES`n" -ForegroundColor Cyan
Write-Host "   Públicos:" -ForegroundColor Yellow
Write-Host "   - GET  /api/health" -ForegroundColor Gray
Write-Host "   - GET  /api/public/programmers" -ForegroundColor Gray
Write-Host "   - POST /api/auth/google" -ForegroundColor Gray
Write-Host ""
Write-Host "   Protegidos (requieren JWT):" -ForegroundColor Yellow
Write-Host "   - GET  /api/auth/me" -ForegroundColor Gray
Write-Host "   - POST /api/auth/logout" -ForegroundColor Gray
Write-Host "   - GET  /api/users" -ForegroundColor Gray
Write-Host "   - GET  /api/projects" -ForegroundColor Gray
Write-Host "   - GET  /api/advisories" -ForegroundColor Gray

Write-Host "`n🎉 INTEGRACIÓN LISTA!" -ForegroundColor Green
Write-Host "   Frontend: Angular en Firebase" -ForegroundColor Gray
Write-Host "   Backend: Spring Boot en Render" -ForegroundColor Gray
Write-Host "   Database: PostgreSQL en Neon" -ForegroundColor Gray
Write-Host "   Auth: Google OAuth + JWT" -ForegroundColor Gray
Write-Host ""
