Porfafolio Ramon Serrano

Este proyecto es un portafolio profesional desarrollado con Angular y Firebase, diseñado para mostrar y gestionar proyectos, usuarios, citas y servicios de consultoría. Incluye autenticación, gestión de usuarios, administración de proyectos, agendamiento de citas y funcionalidades de comunicación.

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
- **Autenticación y roles:** Registro, login y control de acceso por roles (usuario, programador, administrador).
- **Gestión de proyectos:** Visualización, creación y edición de proyectos.
- **Agendamiento de citas:** Solicitud y administración de citas de consultoría.
- **Panel de administración:** Gestión de usuarios, proyectos y citas.
- **Interfaz moderna:** UI responsiva y atractiva.
- **Integración con Firebase:** Autenticación, Firestore y funciones serverless.

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
3. Configura Firebase:
	- Crea un proyecto en [Firebase](https://firebase.google.com/).
	- Descarga tu archivo de configuración y reemplaza los datos en el entorno correspondiente.
	- Configura Firestore y Authentication.
4. Inicia la aplicación:
	```bash
	npm start
	```

## Uso
- Accede a la aplicación en `http://localhost:4200`.
- Regístrate o inicia sesión para acceder a funcionalidades avanzadas.
- Navega por los proyectos, agenda citas o administra usuarios según tu rol.

## Tecnologías Utilizadas
- **Angular** (frontend)
- **Firebase** (backend, autenticación, Firestore, funciones)
- **Node.js** (funciones serverless)
- **SCSS** (estilos)

## Scripts Disponibles
- `npm start`: Inicia la aplicación en modo desarrollo.
- `npm test`: Ejecuta los tests.
- `npm run build`: Compila la aplicación para producción.

## Contribución
¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.

## Licencia
Este proyecto está bajo la licencia MIT.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
