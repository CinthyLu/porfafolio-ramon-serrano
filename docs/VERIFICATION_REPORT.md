# Reporte de Verificación — Portafolio Multiusuario Backend

## Instrucciones de Ejecución (5 minutos)

```powershell
# Desde la raíz del proyecto
.\scripts\00-check-prereqs.ps1    # Verificar herramientas
.\scripts\01-db-up.ps1            # Levantar PostgreSQL
.\scripts\02-backend-run.ps1      # Arrancar backend (dejar corriendo)
# --- En otra terminal ---
.\scripts\03-smoke-tests.ps1      # Smoke tests
.\scripts\04-db-inspect.ps1       # Inspección DB
```

## Checklist de Verificación

| # | Requisito | Cómo se prueba | Evidencia | Estado |
|---|-----------|----------------|-----------|--------|
| 1 | PostgreSQL corriendo en Docker | `docker ps` muestra `portfolio-postgres` healthy | `01-db-up.ps1` output | ⬜ |
| 2 | Flyway crea tablas + seed | `04-db-inspect.ps1` → flyway_schema_history + tablas con datos | `evidence/db/db-check.txt` | ⬜ |
| 3 | Backend arranca sin errores | `02-backend-run.ps1` → Spring Boot started | `evidence/logs/backend-startup.log` | ⬜ |
| 4 | Health endpoint responde | `GET /api/health` → `{"status":"UP"}` | `evidence/smoke/Health_Check.json` | ⬜ |
| 5 | Swagger UI accesible | `GET /swagger-ui/index.html` → 200 | `evidence/smoke/Swagger_UI.json` | ⬜ |
| 6 | API Docs JSON | `GET /api-docs` → JSON con openapi | `evidence/smoke/OpenAPI_Docs.json` | ⬜ |
| 7 | Programadores seed visibles | `GET /api/public/programmers` → lista con datos | `evidence/smoke/Public_Programmers.json` | ⬜ |
| 8 | Portfolio con proyectos | `GET /api/public/programmers/{id}/portfolio` → proyectos + availability | `evidence/smoke/Programmer_Portfolio.json` | ⬜ |
| 9 | JWT + Security configurado | Endpoints `/api/admin/**` devuelven 401/403 sin token | Manual: `curl -v /api/admin/programmers` | ⬜ |
| 10 | CORS habilitado | Headers `Access-Control-Allow-Origin` presentes | Manual: preflight request | ⬜ |
| 11 | DB tiene 5 tablas principales | `04-db-inspect.ps1` lista: users, projects, availability, advisories, notification_log | `evidence/db/db-check.txt` | ⬜ |
| 12 | Seed: 3+ usuarios por rol | Consulta `users` agrupada por role | `evidence/db/db-check.txt` | ⬜ |

## Cómo Marcar Estado

Ejecutar los scripts en orden. Si el test pasa → ✅. Si falla → ❌ con nota.
Los archivos en `evidence/` se generan automáticamente para entregar como prueba.

## Estructura de Evidencias

```
evidence/
├── smoke/
│   ├── smoke-results.json         # Resumen de todos los tests
│   ├── Health_Check.json          # Respuesta /api/health
│   ├── Swagger_UI.json            # Respuesta swagger-ui
│   ├── OpenAPI_Docs.json          # Respuesta /api-docs
│   ├── Public_Programmers.json    # Respuesta /api/public/programmers
│   └── Programmer_Portfolio.json  # Respuesta portfolio
├── db/
│   └── db-check.txt               # Inspección completa de BD
└── logs/
    └── backend-startup.log         # Log de arranque Spring Boot
```
