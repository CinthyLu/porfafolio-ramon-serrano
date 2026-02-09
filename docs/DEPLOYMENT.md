# Guía de Deployment

## Frontend - Firebase Hosting

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Inicializar proyecto
```bash
cd frontend
firebase init hosting
# Seleccionar: dist/frontend/browser
# SPA: Yes
```

### 3. Build y deploy
```bash
ng build --configuration=production
firebase deploy --only hosting
```

## Backend - Render

### 1. Crear cuenta en Render
https://render.com

### 2. Conectar repositorio GitHub

### 3. Crear Web Service
- Runtime: Docker o Java
- Build: `./mvnw clean package -DskipTests`
- Start: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

### 4. Variables de entorno
```
DB_URL=jdbc:postgresql://host:5432/db
DB_USER=user
DB_PASS=pass
JWT_SECRET=your-secret
CORS_ORIGINS=https://your-app.web.app
GOOGLE_CLIENT_ID=your-client-id
```

## Base de Datos - Railway PostgreSQL

### 1. Crear cuenta en Railway
https://railway.app

### 2. Crear PostgreSQL service

### 3. Copiar connection string

## URLs Finales
- Frontend: https://portfolio-multiusuario.web.app
- Backend: https://portfolio-api.onrender.com
- Swagger: https://portfolio-api.onrender.com/swagger-ui.html
