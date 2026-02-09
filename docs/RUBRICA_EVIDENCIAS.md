# Evidencias para Rúbrica — Portafolio Multiusuario

## Mapping: Criterio → Evidencia

| Criterio | Tipo | Endpoint / Archivo | Cómo Verificar |
|----------|------|-------------------|----------------|
| **Base de datos relacional** | DB | Flyway migrations V1-V6 | `04-db-inspect.ps1` → tablas + relaciones FK |
| **CRUD Usuarios** | API | `GET/POST/PUT/DELETE /api/admin/programmers` | Swagger UI → probar con token ADMIN |
| **CRUD Proyectos** | API | `GET/POST/PUT/DELETE /api/programmer/projects` | Swagger UI → probar con token PROGRAMMER |
| **CRUD Disponibilidad** | API | `GET/POST/PUT/DELETE /api/programmer/availability` | Swagger UI → probar con token PROGRAMMER |
| **Sistema de asesorías** | API | `POST /api/external/advisories` + approve/reject/complete | Swagger UI → flujo completo |
| **Autenticación JWT** | Security | `POST /api/auth/google` | Token exchange → JWT en response |
| **Roles (RBAC)** | Security | SecurityConfig.java | Endpoints protegidos por rol |
| **Swagger/OpenAPI** | Doc | `GET /swagger-ui/index.html` | `03-smoke-tests.ps1` → Swagger_UI.json |
| **Documentación API** | Doc | `GET /api-docs` | JSON con todos los endpoints |
| **Reportes PDF** | Export | `GET /api/programmer/reports/advisories/pdf` | Descarga archivo PDF con tabla |
| **Reportes Excel** | Export | `GET /api/programmer/reports/advisories/excel` | Descarga archivo XLSX |
| **Notificaciones Email** | Log | NotificationService.java | Logs: `[Mock Email] To: ...` |
| **Notificaciones WhatsApp** | Log | NotificationService.java | Logs: `[Mock WhatsApp] To: ...` |
| **Scheduler automático** | Cron | AdvisoryReminderScheduler.java | Cron `0 0 10 * * *` en logs |
| **Dashboard métricas** | API | `GET /api/admin/dashboard` | JSON con conteos por estado |
| **Seed data** | DB | V6__seed_demo_data.sql | `04-db-inspect.ps1` → registros |
| **Health check** | API | `GET /api/health` | `03-smoke-tests.ps1` |
| **Docker PostgreSQL** | Infra | database/docker-compose.yml | `01-db-up.ps1` |
| **CORS configurado** | Config | CorsConfig.java | Respuesta incluye headers CORS |

## Cómo Generar Todas las Evidencias

```powershell
# 1. Prerrequisitos
.\scripts\00-check-prereqs.ps1

# 2. Base de datos
.\scripts\01-db-up.ps1

# 3. Backend (dejar corriendo)
.\scripts\02-backend-run.ps1

# 4. En otra terminal: smoke tests + DB inspect
.\scripts\03-smoke-tests.ps1
.\scripts\04-db-inspect.ps1
```

Resultados en carpeta `evidence/` listos para entregar.

## Evidencias de Reportes (Manual con Swagger)

1. Abrir `http://localhost:8080/swagger-ui/index.html`
2. Hacer login con token JWT (POST /api/auth/google)
3. Copiar token → Authorize (candado)
4. Probar: GET `/api/programmer/reports/advisories/pdf` → descarga PDF
5. Probar: GET `/api/programmer/reports/projects/excel` → descarga XLSX
6. Captura de pantalla como evidencia

## Evidencias de Notificaciones (En log del backend)

El log de arranque (`evidence/logs/backend-startup.log`) mostrará:
- `[Mock Email]` cuando se solicita una asesoría
- `[Mock WhatsApp]` para números con teléfono registrado
- El scheduler corre a las 10:00 AM automáticamente
