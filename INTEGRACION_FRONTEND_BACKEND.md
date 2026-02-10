# Guía de Integración Frontend-Backend

## Estado Actual
✅ Backend desplegado en Render: https://repositorio-backend-proyectofinal.onrender.com
✅ Frontend migrado para consumir backend REST
✅ Servicios Angular actualizados (Auth, Project, Appointment, User)
✅ Google Sign-In implementado con backend

## Pasos Finales para Completar la Integración

### 1. Configurar CORS en Render

Debes agregar el origen del frontend a las variables de entorno en Render:

1. Ve a tu servicio en Render Dashboard
2. Ve a **Environment** → **Environment Variables**
3. Agrega o actualiza la variable `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://portafolio-ramon-serrano.web.app,http://localhost:4200
   ```
4. Guarda los cambios y el backend se redesplegará automáticamente

### 2. Verificar Variables de Entorno en Render

Asegúrate de que todas estas variables estén configuradas:

```
DB_URL=jdbc:postgresql://ep-misty-glitter-aitnbkdg-pooler.us-east-1.aws.neon.tech:5432/neondb?sslmode=require&channelBinding=require
DB_USER=neondb_owner
DB_PASS=<tu-password>
GOOGLE_CLIENT_ID=320854215368-h2jrnsaglbup26ghhik7h5kck64s3hv6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
JWT_SECRET=VHWDi3zen36CGzy0SbvZXgMbtjvsFU9I/koDnDImxYe3hF0uUppJQiT2NxbQ2BUZgrFIKf5Y/D6eAxhWAmB/2g==
CORS_ORIGINS=https://portafolio-ramon-serrano.web.app,http://localhost:4200
MAIL_USERNAME=<tu-email-gmail>
MAIL_PASSWORD=<tu-app-password-gmail>
```

### 3. Rebuild y Deploy del Frontend

Instala dependencias y construye el proyecto:

```powershell
# Instalar dependencias (solo si hace falta)
npm install

# Build para producción
npm run build

# Deploy a Firebase
firebase deploy
```

### 4. Probar la Integración Localmente (Opcional)

Antes de desplegar, puedes probar localmente:

```powershell
# Ejecutar en modo desarrollo
npm start

# Abrir http://localhost:4200
```

El frontend local usará `http://localhost:8080/api` si el backend está corriendo localmente.

### 5. Verificar que Todo Funcione

Una vez desplegado, verifica:

1. **Backend Health Check**
   - https://repositorio-backend-proyectofinal.onrender.com/api/health
   - Debe responder: `{"status":"UP"}`

2. **Swagger UI**
   - https://repositorio-backend-proyectofinal.onrender.com/swagger-ui.html
   - Debe mostrar la documentación de la API

3. **Login con Google**
   - Ve a https://portafolio-ramon-serrano.web.app
   - Haz clic en "Login with Google"
   - Debe redirigir correctamente y mantener la sesión

4. **Endpoints Protegidos**
   - Intenta acceder a secciones que requieren autenticación
   - Debe funcionar correctamente con el JWT token

### 6. Verificar el Flujo Completo

Prueba estas funcionalidades:

- ✅ Login con Google
- ✅ Listar programadores (endpoint público)
- ✅ Crear asesorías (requiere auth)
- ✅ Ver proyectos (requiere auth)
- ✅ Dashboard de administrador (requiere role ADMIN)
- ✅ Logout

## Cambios Realizados

### Archivos Creados
- `src/environments/environment.ts` - Configuración para desarrollo
- `src/environments/environment.prod.ts` - Configuración para producción
- `src/app/services/auth.interceptor.ts` - Interceptor para agregar JWT tokens

### Archivos Modificados
- `src/app/app.config.ts` - Agregado HttpClient
- `src/app/services/auth.service.ts` - Migrado a backend REST
- `src/app/services/project.service.ts` - Migrado a backend REST
- `src/app/services/appointment.service.ts` - Migrado a backend REST
- `src/app/services/user.service.ts` - Migrado a backend REST
- `src/app/features/forms/login/login.ts` - Actualizado para usar Google Sign-In con backend
- `src/app/features/forms/register/register.ts` - Actualizado para usar Google Sign-In con backend
- `src/index.html` - Agregado script de Google Identity Services
- `angular.json` - Configurado fileReplacements para producción

### Dependencias de Firebase Eliminadas
El frontend ya NO usa:
- Firebase Authentication (ahora usa backend REST + JWT)
- Firestore (ahora usa backend REST con PostgreSQL)

Firebase solo se usa para **hosting estático**.

## Solución de Problemas

### Error de CORS
**Síntoma:** Errores `Access-Control-Allow-Origin` en la consola del navegador

**Solución:** Verifica que `CORS_ORIGINS` en Render incluya tu dominio de frontend

### Token Expirado
**Síntoma:** Error 401 después de cierto tiempo

**Solución:** El backend usa refresh tokens. El frontend debería intentar refrescar automáticamente (implementado en `AuthService.tryRefreshToken()`)

### Google Sign-In No Funciona
**Síntoma:** Botón de Google no aparece o no responde

**Solución:** 
1. Verifica que el script de Google esté cargado en `index.html`
2. Verifica que el `client_id` sea correcto en los componentes

### Backend No Responde
**Síntoma:** Timeouts o errores de conexión

**Solución:** 
1. Verifica que el servicio en Render esté activo
2. Los servicios gratuitos de Render se duermen después de inactividad (tardan ~30s en despertar)

## Endpoints del Backend

### Públicos (No requieren autenticación)
- `GET /api/health` - Health check
- `GET /api/public/programmers` - Lista de programadores
- `POST /api/auth/google` - Login con Google
- `POST /api/auth/refresh` - Refrescar token

### Protegidos (Requieren JWT token)
- `GET /api/auth/me` - Perfil del usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/advisories` - Listar asesorías
- `POST /api/advisories` - Crear asesoría

### Solo Admin
- `GET /api/admin/users` - Gestión de usuarios
- `GET /api/admin/reports/**` - Reportes generados
- `GET /api/admin/dashboard` - Dashboard de estadísticas

## Siguiente Paso Recomendado

1. **Configura CORS en Render** (paso más importante)
2. **Deploy del frontend** con `npm run build && firebase deploy`
3. **Prueba el login** en el sitio publicado
4. **Verifica los endpoints** en Swagger UI

¡Listo! Tu aplicación estará completamente integrada con backend en Render y frontend en Firebase Hosting.
