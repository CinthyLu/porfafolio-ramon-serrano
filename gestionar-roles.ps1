# Script para conectar a Neon PostgreSQL
# =========================================

Write-Host "`n🔌 CONECTAR A NEON POSTGRESQL`n" -ForegroundColor Cyan

Write-Host "Para conectarte a tu base de datos Neon, usa uno de estos métodos:`n" -ForegroundColor Yellow

Write-Host "1️⃣  Usando psql (PostgreSQL CLI):" -ForegroundColor Green
Write-Host "   psql 'postgresql://neondb_owner:[password]@ep-misty-glitter-aitnbkdg-pooler.us-east-1.aws.neon.tech:5432/neondb?sslmode=require'" -ForegroundColor Gray

Write-Host "`n2️⃣  Usando el Dashboard de Neon:" -ForegroundColor Green
Write-Host "   - Ve a https://console.neon.tech" -ForegroundColor Gray
Write-Host "   - Selecciona tu proyecto" -ForegroundColor Gray
Write-Host "   - Ve a SQL Editor" -ForegroundColor Gray
Write-Host "   - Ejecuta las queries directamente" -ForegroundColor Gray

Write-Host "`n3️⃣  Usando DBeaver/pgAdmin/DataGrip:" -ForegroundColor Green
Write-Host "   Host: ep-misty-glitter-aitnbkdg-pooler.us-east-1.aws.neon.tech" -ForegroundColor Gray
Write-Host "   Port: 5432" -ForegroundColor Gray
Write-Host "   Database: neondb" -ForegroundColor Gray
Write-Host "   User: neondb_owner" -ForegroundColor Gray
Write-Host "   Password: [tu-password]" -ForegroundColor Gray
Write-Host "   SSL: Required" -ForegroundColor Gray

Write-Host "`n📝 QUERIES ÚTILES:`n" -ForegroundColor Cyan

Write-Host "-- Ver todos los usuarios y sus roles" -ForegroundColor Yellow
Write-Host "SELECT id, email, full_name, role FROM users;" -ForegroundColor Gray

Write-Host "`n-- Cambiar rol a ADMIN" -ForegroundColor Yellow
Write-Host "UPDATE users SET role = 'ADMIN' WHERE email = 'tu-email@gmail.com';" -ForegroundColor Gray

Write-Host "`n-- Cambiar rol a PROGRAMMER" -ForegroundColor Yellow
Write-Host "UPDATE users SET role = 'PROGRAMMER' WHERE email = 'tu-email@gmail.com';" -ForegroundColor Gray

Write-Host "`n-- Cambiar rol a USER" -ForegroundColor Yellow
Write-Host "UPDATE users SET role = 'USER' WHERE email = 'tu-email@gmail.com';" -ForegroundColor Gray

Write-Host "`n-- Ver estructura de la tabla users" -ForegroundColor Yellow
Write-Host "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';" -ForegroundColor Gray

Write-Host "`n✅ Roles disponibles: USER, PROGRAMMER, ADMIN`n" -ForegroundColor Green
