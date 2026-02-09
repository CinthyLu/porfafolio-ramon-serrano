# Ejemplos de API

## Autenticación

### POST /api/auth/google
Intercambia token de Firebase por JWT propio.

```bash
curl -X POST http://localhost:8080/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Respuesta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PROGRAMMER"
  }
}
```

---

## Endpoints Públicos

### GET /api/public/programmers
Lista todos los programadores activos.

```bash
curl http://localhost:8080/api/public/programmers
```

**Respuesta:**
```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Juan Developer",
      "email": "dev1@portfolio.com",
      "bio": "Desarrollador Full Stack con 5 años de experiencia",
      "avatarUrl": "https://...",
      "projectCount": 8
    }
  ],
  "totalElements": 2,
  "totalPages": 1
}
```

### GET /api/public/programmers/{id}/portfolio
Obtiene el portafolio completo de un programador.

```bash
curl http://localhost:8080/api/public/programmers/550e8400-e29b-41d4-a716-446655440001/portfolio
```

**Respuesta:**
```json
{
  "programmer": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Juan Developer",
    "bio": "Desarrollador Full Stack..."
  },
  "projects": [
    {
      "id": "...",
      "title": "Sistema de Inventarios",
      "description": "Sistema completo de gestión de inventarios",
      "projectType": "LABORAL",
      "roleInProject": "BACKEND",
      "technologies": ["Java", "Spring Boot", "PostgreSQL"],
      "repoUrl": "https://github.com/...",
      "demoUrl": "https://demo.com/inventarios",
      "status": "COMPLETED"
    }
  ],
  "availability": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "12:00"
    }
  ]
}
```

---

## Endpoints Admin (requiere rol ADMIN)

### GET /api/admin/programmers
Lista programadores con paginación.

```bash
curl http://localhost:8080/api/admin/programmers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### POST /api/admin/programmers
Crea un nuevo programador.

```bash
curl -X POST http://localhost:8080/api/admin/programmers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@portfolio.com",
    "name": "Nuevo Programador",
    "phone": "+1234567890",
    "bio": "Desarrollador Junior"
  }'
```

### PUT /api/admin/programmers/{id}
Actualiza un programador.

```bash
curl -X PUT http://localhost:8080/api/admin/programmers/550e8400-... \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nombre Actualizado",
    "bio": "Nueva bio"
  }'
```

### DELETE /api/admin/programmers/{id}
Elimina (desactiva) un programador.

```bash
curl -X DELETE http://localhost:8080/api/admin/programmers/550e8400-... \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

---

## Endpoints Programmer (requiere rol PROGRAMMER)

### GET /api/programmer/projects
Lista proyectos propios.

```bash
curl http://localhost:8080/api/programmer/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### POST /api/programmer/projects
Crea un proyecto.

```bash
curl -X POST http://localhost:8080/api/programmer/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Proyecto",
    "description": "Descripción del proyecto",
    "projectType": "ACADEMIC",
    "roleInProject": "FULLSTACK",
    "technologies": ["Angular", "Spring Boot"],
    "repoUrl": "https://github.com/...",
    "demoUrl": "https://demo.com/...",
    "status": "IN_PROGRESS"
  }'
```

### GET /api/programmer/availability
Lista disponibilidad.

```bash
curl http://localhost:8080/api/programmer/availability \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### POST /api/programmer/availability
Agrega disponibilidad.

```bash
curl -X POST http://localhost:8080/api/programmer/availability \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "12:00"
  }'
```

### GET /api/programmer/advisories
Lista asesorías recibidas.

```bash
curl http://localhost:8080/api/programmer/advisories \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

### PUT /api/programmer/advisories/{id}/approve
Aprueba una asesoría.

```bash
curl -X PUT http://localhost:8080/api/programmer/advisories/550e8400-.../approve \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Confirmado, nos vemos!"
  }'
```

### PUT /api/programmer/advisories/{id}/reject
Rechaza una asesoría.

```bash
curl -X PUT http://localhost:8080/api/programmer/advisories/550e8400-.../reject \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Lo siento, no estoy disponible ese día"
  }'
```

---

## Endpoints External (requiere rol EXTERNAL)

### POST /api/external/advisories
Solicita una asesoría.

```bash
curl -X POST http://localhost:8080/api/external/advisories \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "programmerId": "550e8400-e29b-41d4-a716-446655440001",
    "scheduledAt": "2024-02-15T10:00:00",
    "comment": "Necesito ayuda con Spring Security"
  }'
```

**Respuesta exitosa:**
```json
{
  "id": "550e8400-...",
  "programmer": { "name": "Juan Developer" },
  "scheduledAt": "2024-02-15T10:00:00",
  "status": "PENDING",
  "comment": "Necesito ayuda con Spring Security"
}
```

**Error - Fuera de disponibilidad:**
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "El programador no está disponible en ese horario"
}
```

**Error - Solape:**
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Ya existe una asesoría programada en ese horario"
}
```

### GET /api/external/advisories
Lista asesorías propias.

```bash
curl http://localhost:8080/api/external/advisories \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

---

## Endpoints Reportes (requiere rol ADMIN)

### GET /api/admin/reports/advisories.pdf
Descarga reporte PDF de asesorías.

```bash
curl http://localhost:8080/api/admin/reports/advisories.pdf \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -o advisories.pdf
```

### GET /api/admin/reports/advisories.xlsx
Descarga reporte Excel de asesorías.

```bash
curl http://localhost:8080/api/admin/reports/advisories.xlsx \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -o advisories.xlsx
```

### GET /api/admin/reports/projects.pdf
Descarga reporte PDF de proyectos.

```bash
curl "http://localhost:8080/api/admin/reports/projects.pdf?userId=550e8400-..." \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -o projects.pdf
```

---

## Endpoints Métricas (requiere rol ADMIN o PROGRAMMER)

### GET /api/admin/metrics/advisories
Obtiene métricas de asesorías.

```bash
curl http://localhost:8080/api/admin/metrics/advisories \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

**Respuesta:**
```json
{
  "byStatus": {
    "PENDING": 5,
    "APPROVED": 12,
    "REJECTED": 3,
    "COMPLETED": 25,
    "CANCELLED": 2
  },
  "byWeek": [
    { "week": "2024-W05", "count": 8 },
    { "week": "2024-W06", "count": 12 },
    { "week": "2024-W07", "count": 15 }
  ],
  "topTechnologies": [
    { "name": "Spring Boot", "count": 15 },
    { "name": "Angular", "count": 12 },
    { "name": "PostgreSQL", "count": 8 }
  ]
}
```

---

## Códigos de Error

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 400 | Validación fallida | Campos requeridos faltantes |
| 401 | No autenticado | Token faltante o expirado |
| 403 | No autorizado | Rol incorrecto o recurso de otro usuario |
| 404 | No encontrado | ID inexistente |
| 500 | Error interno | Error de servidor |
