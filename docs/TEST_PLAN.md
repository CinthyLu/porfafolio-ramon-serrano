# Plan de Testing

## Casos de Prueba por Rol

### 1. Autenticación

| ID | Caso | Resultado Esperado |
|----|------|-------------------|
| AUTH-01 | Login con Google | Redirige al dashboard según rol |
| AUTH-02 | Token exchange | POST /auth/google retorna JWT |
| AUTH-03 | Logout | Redirige a login, token eliminado |
| AUTH-04 | Token expirado | 401 Unauthorized |

### 2. Admin

| ID | Caso | Resultado Esperado |
|----|------|-------------------|
| ADM-01 | Ver lista programadores | Lista con paginación |
| ADM-02 | Crear programador | Programador aparece en lista |
| ADM-03 | Editar programador | Cambios guardados |
| ADM-04 | Eliminar programador | Programador eliminado |
| ADM-05 | Descargar PDF | Archivo descargado |
| ADM-06 | Descargar Excel | Archivo descargado |

### 3. Programmer

| ID | Caso | Resultado Esperado |
|----|------|-------------------|
| PRG-01 | Ver mis proyectos | Lista de proyectos propios |
| PRG-02 | Crear proyecto | Proyecto creado |
| PRG-03 | Editar proyecto propio | Cambios guardados |
| PRG-04 | Agregar disponibilidad | Horario agregado |
| PRG-05 | Aprobar asesoría | Estado: APPROVED |
| PRG-06 | Rechazar asesoría | Estado: REJECTED |

### 4. External

| ID | Caso | Resultado Esperado |
|----|------|-------------------|
| EXT-01 | Ver programadores | Lista visible |
| EXT-02 | Ver portafolio | Proyectos y disponibilidad |
| EXT-03 | Solicitar asesoría válida | Estado: PENDING |
| EXT-04 | Fuera de disponibilidad | Error 400 |
| EXT-05 | Solape de horario | Error 400 |

### 5. Seguridad

| ID | Caso | Resultado Esperado |
|----|------|-------------------|
| SEC-01 | Acceso Admin sin rol | 403 Forbidden |
| SEC-02 | Editar recurso ajeno | 403 Forbidden |
| SEC-03 | Request sin token | 401 Unauthorized |

## Checklist Pre-Producción

- [ ] Todos los tests pasan
- [ ] No hay errores en consola
- [ ] Migraciones aplicadas
- [ ] Datos demo cargados
- [ ] CORS funcionando
- [ ] SSL habilitado
