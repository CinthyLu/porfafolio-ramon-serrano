Porfafolio Ramon Serrano

Este proyecto es un portafolio profesional desarrollado con Angular y Firebase, diseñado para mostrar y gestionar proyectos, usuarios, citas y servicios de consultoría. Incluye autenticación, gestión de usuarios, administración de proyectos, agendamiento de citas, comunicación interna y notificaciones.

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Scripts Disponibles](#scripts-disponibles)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Descripción General
Este portafolio permite a los usuarios:
- Visualizar información profesional y proyectos.
- Registrarse e iniciar sesión.
- Solicitar y gestionar citas de consultoría.
- Administrar proyectos y usuarios (según roles).
- Comunicarse mediante formularios y notificaciones.

## Características Principales
- **Autenticación y roles:**
	- Registro de nuevos usuarios.
	- Inicio de sesión seguro.
	- Control de acceso por roles (usuario, programador, administrador).
- **Gestión de proyectos:**
	- Visualización de proyectos públicos y privados.
	- Creación, edición y eliminación de proyectos (según permisos).
- **Agendamiento de citas:**
	- Solicitud de citas de consultoría desde la sección de consultoría.
	- Visualización de citas agendadas.
	- Confirmación, edición o cancelación de citas (según rol).
- **Gestión de usuarios:**
	- Listado y administración de usuarios (solo administradores).
	- Asignación de roles y permisos.
- **Panel de administración:**
	- Gestión centralizada de usuarios, proyectos y citas.
- **Comunicación y notificaciones:**
	- Envío de mensajes internos y notificaciones de eventos importantes.
	- Formularios de contacto y confirmaciones.
- **Interfaz moderna:**
	- UI responsiva y atractiva, compatible con dispositivos móviles.
- **Integración con Firebase:**
	- Autenticación, Firestore y funciones serverless para lógica de backend.

## Estructura del Proyecto
```
porfafolio-ramon-serrano/
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── consulting/         # Consultoría y agendamiento
│   │   │   ├── forms/              # Login y registro
│   │   │   ├── home/               # Página principal
│   │   │   └── management/         # Administración de citas, proyectos y usuarios
│   │   ├── models/                 # Modelos de datos
│   │   ├── services/               # Servicios de negocio y comunicación
│   │   ├── guards/                 # Guards de rutas y roles
│   │   ├── pages/                  # Header, footer y páginas generales
│   │   └── pop-ups/                # Componentes de diálogo
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── functions/                      # Funciones serverless (Node.js)
├── public/                         # Archivos estáticos
├── angular.json                    # Configuración Angular
├── firebase.json                   # Configuración Firebase
├── package.json                    # Dependencias y scripts
└── README.md                       # Este archivo
```

## Instalación
1. Clona el repositorio:
	```bash
	git clone https://github.com/tu-usuario/porfafolio-ramon-serrano.git
	cd porfafolio-ramon-serrano
	```
2. Instala las dependencias:
	```bash
	npm install
	```
3. Configura el backend (Spring Boot):
	- Crea una base de datos PostgreSQL llamada `portfolio_db`.
	- Configura las variables de entorno en tu terminal:
		- `DB_URL=jdbc:postgresql://localhost:5432/portfolio_db`
		- `DB_USER=portfolio_user`
		- `DB_PASS=portfolio_pass`
		- `JWT_SECRET=tu_secreto_largo`
		- `CORS_ORIGINS=http://localhost:4200`
		- `GOOGLE_CLIENT_ID=tu_google_client_id`
		- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (si habilitas correo real)
	- Inicia el backend:
		```bash
		cd backend
		mvn spring-boot:run
		```
4. Configura el frontend:
	- Actualiza el `environment.ts` con la URL del backend (`http://localhost:8080`).
5. Inicia la aplicación:
	```bash
	npm start
	```

## Uso
1. **Acceso a la aplicación:**
	- Ingresa a `http://localhost:4200`.
2. **Registro e inicio de sesión:**
	- Regístrate como nuevo usuario o inicia sesión con tus credenciales.
	- El sistema asigna permisos según el rol (usuario, programador, administrador).
3. **Visualización de proyectos:**
	- Explora los proyectos disponibles desde la sección principal.
	- Si tienes permisos, puedes crear, editar o eliminar proyectos.
4. **Solicitar y gestionar citas:**
	- Ve a la sección de consultoría y solicita una cita.
	- Consulta el estado de tus citas y recibe notificaciones de confirmación o cambios.
	- Los administradores y programadores pueden gestionar todas las citas.
5. **Gestión de usuarios:**
	- Los administradores pueden ver, editar y eliminar usuarios, así como asignar roles.
6. **Comunicación y notificaciones:**
	- Utiliza los formularios de contacto para enviar mensajes o recibir notificaciones importantes.
7. **Panel de administración:**
	- Accede a la administración centralizada para gestionar usuarios, proyectos y citas (según permisos).

## Tecnologías Utilizadas
- **Angular** (frontend)
- **Spring Boot** (backend)
- **PostgreSQL** (base de datos relacional)
- **JWT** (autenticación)
- **Swagger/OpenAPI** (documentación)
- **SCSS** (estilos)

## Scripts Disponibles
- `npm start`: Inicia la aplicación en modo desarrollo.
- `npm test`: Ejecuta los tests.
- `npm run build`: Compila la aplicación para producción.

## Contribución
¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.


## Informe de Desarrollo

### Proceso de desarrollo
El desarrollo de este portafolio se realizó siguiendo una arquitectura modular basada en Angular, separando las funcionalidades en módulos y componentes reutilizables. Se empleó Firebase para la autenticación, base de datos en tiempo real (Firestore) y funciones serverless, permitiendo una integración ágil y escalable.

El flujo de trabajo incluyó:
- Análisis de requerimientos y definición de roles (usuario, programador, administrador).
- Diseño de la estructura de carpetas y modelos de datos.
- Implementación de la autenticación y guards de rutas.
- Desarrollo de componentes para gestión de proyectos, usuarios y citas.
- Integración de servicios de comunicación y notificaciones.
- Pruebas unitarias y de integración.

### Decisiones de diseño
- **Angular** fue elegido por su robustez, modularidad y ecosistema.
- **Firebase** por su facilidad de integración, autenticación segura y base de datos en tiempo real.
- **SCSS** para estilos escalables y mantenibles.
- Separación clara entre lógica de negocio (servicios), presentación (componentes) y modelos de datos.
- Uso de guards para proteger rutas según roles.

### Desafíos enfrentados
- Integrar la autenticación de Firebase con el control de roles personalizados.
- Sincronizar datos en tiempo real entre Firestore y la UI.
- Manejar la escalabilidad de la gestión de citas y proyectos.
- Garantizar una experiencia de usuario fluida y responsiva en todos los dispositivos.
- Implementar notificaciones y confirmaciones en tiempo real.

## Documentación de Configuración y Despliegue

### Configuración local
1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala las dependencias con `npm install`.
3. Crea un proyecto en Firebase y configura Authentication (correo/contraseña) y Firestore.
4. Descarga el archivo de configuración de Firebase y colócalo en el entorno adecuado (`src/environments/environment.ts`).
5. Inicia la aplicación con `npm start` o `ng serve`.
6. Accede a `http://localhost:4200`.

### Despliegue en producción
1. Ejecuta `ng build --prod` para generar los archivos de producción en la carpeta `dist/`.
2. Si usas Firebase Hosting:
	- Instala Firebase CLI: `npm install -g firebase-tools`.
	- Ejecuta `firebase login` y luego `firebase init` para configurar el hosting.
	- Sube la aplicación con `firebase deploy`.
3. Alternativamente, puedes desplegar el contenido de `dist/` en cualquier servidor web estático.

## Guía de Usuario

### Para usuarios finales
1. **Registro e inicio de sesión:**
	- Accede a la página principal y regístrate con tu correo y contraseña.
	- Inicia sesión para acceder a tus proyectos y citas.
2. **Explorar proyectos:**
	- Visualiza los proyectos disponibles y sus detalles.
3. **Solicitar citas:**
	- Ve a la sección de consultoría y solicita una cita con un programador.
	- Recibe notificaciones sobre el estado de tu cita.
4. **Editar perfil:**
	- Accede a tu perfil para actualizar tu información personal.

### Para administradores
1. **Gestión de usuarios:**
	- Accede al panel de administración para ver, editar o eliminar usuarios.
	- Asigna roles (usuario, programador, administrador).
2. **Gestión de proyectos:**
	- Crea, edita o elimina proyectos desde la sección de administración.
3. **Gestión de citas:**
	- Visualiza todas las citas agendadas, confirma, edita o cancela según sea necesario.
4. **Notificaciones y comunicación:**
	- Envía mensajes o notificaciones a usuarios y programadores.


