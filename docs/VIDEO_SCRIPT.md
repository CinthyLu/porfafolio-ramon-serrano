# Guión de Video - 10 Minutos

## Objetivo
Demostrar todas las funcionalidades del sistema para obtener la nota máxima.

---

## 1. Arquitectura (1:00)

**[Pantalla: Diagrama de ARCHITECTURE.md]**

> "Buenas tardes, voy a presentar el Portafolio Multiusuario.
> 
> La arquitectura consiste en:
> - **Frontend Angular 17** desplegado en Firebase Hosting
> - **Backend Spring Boot 3** en Render con API REST y JWT
> - **PostgreSQL** como base de datos relacional
> 
> El flujo de autenticación usa **Token Exchange**: 
> 1. Usuario hace login con Google en Firebase
> 2. Frontend envía el token a nuestro backend
> 3. Backend valida con Firebase y emite un JWT propio con el rol
> 
> Tenemos 3 roles: ADMIN, PROGRAMMER y EXTERNAL."

---

## 2. URL Pública Frontend (0:20)

**[Pantalla: Browser navegando a URL de producción]**

> "El frontend está desplegado en Firebase Hosting.
> 
> Navego a: `https://portfolio-multiusuario.web.app`
> 
> Vemos la página de inicio con el listado público de programadores."

---

## 3. Login con Google (0:30)

**[Pantalla: Click en Login, popup de Google]**

> "Hago click en 'Iniciar Sesión'.
> 
> Se abre el popup de Google Sign-In.
> 
> Selecciono mi cuenta de Google.
> 
> El sistema me redirige al dashboard según mi rol.
> 
> En DevTools > Network pueden ver el POST a /auth/google y la respuesta con el JWT."

---

## 4. Admin CRUD (2:00)

**[Pantalla: Dashboard Admin]**

> "Ingresé como ADMIN. Veo el dashboard con estadísticas globales.
> 
> **Crear Programador:**
> - Click en 'Programadores' > 'Nuevo'
> - Completo: nombre, email, teléfono, bio
> - Click 'Guardar'
> - Vemos el programador en la lista
> 
> **Editar Programador:**
> - Click en el ícono de editar
> - Cambio la bio
> - Click 'Guardar'
> 
> **Eliminar Programador:**
> - Click en el ícono de eliminar
> - Confirmo
> - El programador desaparece de la lista
> 
> En Swagger también podemos ver estos endpoints:
> - POST /api/admin/programmers
> - PUT /api/admin/programmers/{id}
> - DELETE /api/admin/programmers/{id}"

---

## 5. Programador: Proyectos + Disponibilidad + Asesorías (3:00)

**[Pantalla: Login como PROGRAMMER]**

> "Ahora ingreso como PROGRAMADOR.
> 
> **Proyectos:**
> - Veo mi portafolio actual
> - Click 'Nuevo Proyecto'
> - Tipo: LABORAL
> - Título: 'Sistema de Inventarios'
> - Descripción, rol: BACKEND
> - Tecnologías: Java, Spring Boot, PostgreSQL
> - URLs de repo y demo
> - Estado: COMPLETADO
> - Click 'Guardar'
> 
> El proyecto aparece en mi portafolio público.
> 
> **Disponibilidad:**
> - Click en 'Mi Disponibilidad'
> - Agrego: Lunes 09:00 - 12:00
> - Agrego: Miércoles 14:00 - 18:00
> - Esta disponibilidad se valida al solicitar asesorías
> 
> **Gestión de Asesorías:**
> - Veo las solicitudes pendientes
> - Click en una solicitud
> - Puedo 'Aprobar' con mensaje: 'Confirmado, nos vemos'
> - O 'Rechazar' con mensaje: 'No disponible ese día'
> - El solicitante recibe notificación"

---

## 6. External Solicita Asesoría (2:00)

**[Pantalla: Login como EXTERNAL]**

> "Ingreso como usuario EXTERNO.
> 
> **Explorar Programadores:**
> - Veo el listado público de programadores
> - Click en uno para ver su portafolio
> - Veo sus proyectos y tecnologías
> 
> **Solicitar Asesoría:**
> - Click 'Solicitar Asesoría'
> - Selecciono fecha y hora (dentro de disponibilidad)
> - Escribo comentario: 'Necesito ayuda con Spring Boot'
> - Click 'Enviar Solicitud'
> 
> **Validación de Disponibilidad:**
> - Si intento agendar fuera de horario: error
> - Si intento agendar en hora ocupada: error de solape
> 
> **Mis Asesorías:**
> - Veo el historial de mis solicitudes
> - Estados: PENDIENTE, APROBADA, RECHAZADA, COMPLETADA"

---

## 7. Dashboards + Reportes (1:00)

**[Pantalla: Dashboard con gráficos]**

> "Volvemos al Admin para ver los dashboards.
> 
> **Gráficos:**
> - Asesorías por estado (gráfico de pie)
> - Asesorías por semana (gráfico de líneas)
> - Top tecnologías (gráfico de barras)
> 
> **Reportes:**
> - Click 'Descargar PDF Asesorías'
> - Se descarga el PDF con la tabla de asesorías
> - Click 'Descargar Excel Asesorías'
> - Se descarga el XLSX
> 
> Los reportes pueden filtrarse por fecha y estado."

---

## 8. Swagger + Seguridad (0:40)

**[Pantalla: Swagger UI]**

> "Finalmente, la documentación API en Swagger.
> 
> Navego a: `/swagger-ui.html`
> 
> Vemos todos los endpoints organizados:
> - Auth: /auth/google
> - Public: /public/programmers
> - Admin: /admin/* (requiere rol ADMIN)
> - Programmer: /programmer/* (requiere rol PROGRAMMER)
> - External: /external/* (requiere rol EXTERNAL)
> 
> **Demostración de seguridad:**
> - Sin token: 401 Unauthorized
> - Token de EXTERNAL en endpoint Admin: 403 Forbidden
> - Intentar editar proyecto de otro: 403 Forbidden
> 
> Esto concluye la demostración. ¿Preguntas?"

---

## Tiempo Total: ~10:30 minutos

### Tips para la Presentación
1. Prepara las credenciales de demo listas
2. Ten las URLs guardadas en marcadores
3. Practica el flujo antes de la presentación
4. Abre DevTools antes de empezar para mostrar requests
5. Ten los diagramas de arquitectura listos
