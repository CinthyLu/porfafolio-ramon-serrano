# Arquitectura del Sistema

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Angular)                              │
│                          Firebase Hosting (PROD)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    Auth      │  │   Dashboard  │  │  Portfolio   │  │  Advisories  │    │
│  │   Module     │  │    Module    │  │    Module    │  │    Module    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                           │                                                  │
│                    ┌──────┴──────┐                                          │
│                    │ HTTP Client │ ◄── JWT Interceptor                      │
│                    │  + Guards   │                                          │
│                    └──────┬──────┘                                          │
└───────────────────────────┼─────────────────────────────────────────────────┘
                            │ HTTPS + JWT
                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Spring Boot)                                │
│                        Render / Railway (PROD)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        Security Layer                                 │   │
│  │   Firebase Token Validation → JWT Generation → Role-Based Access     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Auth     │  │   Admin     │  │ Programmer  │  │  External   │        │
│  │ Controller  │  │ Controller  │  │ Controller  │  │ Controller  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │               │               │               │                    │
│  ┌──────┴───────────────┴───────────────┴───────────────┴──────┐            │
│  │                        Service Layer                         │            │
│  │  UserService │ ProjectService │ AdvisoryService │ ReportSvc │            │
│  └──────────────────────────────────────────────────────────────┘            │
│                                    │                                         │
│  ┌──────────────────────────────────────────────────────────────┐            │
│  │                      Repository Layer (JPA)                   │            │
│  └──────────────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PostgreSQL Database                                  │
│                         Railway Postgres (PROD)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  users   │  │ projects │  │advisories│  │availabi- │  │notifica- │      │
│  │          │  │          │  │          │  │  lity    │  │tion_log  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Flujo de Autenticación (Token Exchange)

```
┌────────┐     ┌────────────┐     ┌──────────────┐     ┌───────────┐
│  User  │     │  Frontend  │     │   Firebase   │     │  Backend  │
└───┬────┘     └─────┬──────┘     └──────┬───────┘     └─────┬─────┘
    │                │                    │                   │
    │  1. Click Login│                    │                   │
    │───────────────>│                    │                   │
    │                │                    │                   │
    │                │  2. Google Sign-In │                   │
    │                │───────────────────>│                   │
    │                │                    │                   │
    │                │  3. Firebase Token │                   │
    │                │<───────────────────│                   │
    │                │                    │                   │
    │                │  4. POST /auth/google (idToken)        │
    │                │───────────────────────────────────────>│
    │                │                    │                   │
    │                │                    │    5. Validate    │
    │                │                    │<──────────────────│
    │                │                    │    6. Valid       │
    │                │                    │──────────────────>│
    │                │                    │                   │
    │                │  7. JWT + User Info (role)             │
    │                │<───────────────────────────────────────│
    │                │                    │                   │
    │  8. Dashboard  │                    │                   │
    │<───────────────│                    │                   │
```

## Modelo de Datos

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │    projects     │       │  availability   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │──┐    │ id (UUID) PK    │       │ id (UUID) PK    │
│ email           │  │    │ user_id FK      │───────│ user_id FK      │
│ name            │  │    │ title           │       │ day_of_week     │
│ role            │  └───>│ description     │       │ start_time      │
│ phone           │       │ project_type    │       │ end_time         │
│ bio             │       │ role_in_project │       │ is_active       │
│ avatar_url      │       │ technologies    │       └─────────────────┘
│ firebase_uid    │       │ repo_url        │
│ created_at      │       │ demo_url        │       ┌─────────────────┐
│ updated_at      │       │ status          │       │   advisories    │
│ is_active       │       │ created_at      │       ├─────────────────┤
└─────────────────┘       └─────────────────┘       │ id (UUID) PK    │
                                                     │ programmer_id   │
┌─────────────────┐                                  │ external_id     │
│ notification_log│                                  │ scheduled_at    │
├─────────────────┤                                  │ status          │
│ id (UUID) PK    │                                  │ request_comment │
│ user_id FK      │                                  │ response_message│
│ type (EMAIL/WA) │                                  │ created_at      │
│ destination     │                                  │ updated_at      │
│ subject         │                                  └─────────────────┘
│ payload         │
│ status          │
│ sent_at         │
│ created_at      │
└─────────────────┘
```

## Decisiones Técnicas

### Frontend
- **Angular 17+** con standalone components
- **Angular Material** para UI consistente
- **ng2-charts** (Chart.js) para gráficos
- **Firebase SDK** para autenticación con Google

### Backend
- **Spring Boot 3.x** con Java 17
- **Spring Security** con filtro JWT personalizado
- **Spring Data JPA** con PostgreSQL
- **Flyway** para migraciones
- **OpenPDF + Apache POI** para reportes
- **Swagger/OpenAPI** para documentación

### Base de Datos
- **PostgreSQL 15** con UUID como PK
- Esquema normalizado con FK constraints
- Índices en campos de búsqueda frecuente

### Seguridad
- Token Exchange: Firebase → JWT propio
- Roles: ADMIN, PROGRAMMER, EXTERNAL
- Ownership validation en endpoints
- CORS configurado por ambiente

### Notificaciones
- Email: JavaMail con SMTP (mock si no hay credenciales)
- WhatsApp: Simulado en NotificationLog
- Scheduler: Spring @Scheduled para recordatorios
