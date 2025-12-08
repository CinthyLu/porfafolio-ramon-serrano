# Portafolio Ramon Serrano - Arquitectura de Navegación y Comunicación

## 📋 Descripción General

Este proyecto es un portafolio profesional construido con Angular 17+ que cuenta con:
- ✅ Navegación interconectada entre todos los componentes
- ✅ Servicio de comunicación centralizado para compartir datos
- ✅ Estilo global con Bootstrap personalizado
- ✅ Componentes reutilizables (Header, Footer)
- ✅ Rutas configuradas para todas las secciones

## 🗂️ Estructura de Rutas

```
/ (Home)
├── /login (Iniciar sesión)
├── /register (Registrarse)
├── /portfolio (Mi Portafolio)
├── /projects (Mis Proyectos)
├── /consulting (Servicios de Consultoría)
└── /users (Gestión de Usuarios)
```

## 📦 Componentes Principales

### 1. **Header (app-header)**
- Ubicación: `src/app/pages/header/`
- Descripción: Barra de navegación global con enlaces a todas las rutas
- Importa: `RouterLink`, `RouterLinkActive`
- Características:
  - Enlaces activos con resaltado automático
  - Navegación responsive
  - Posición sticky (pegada en la parte superior)

### 2. **Home**
- Ruta: `/`
- Descripción: Página de inicio con introducción
- Contiene: Botones de navegación rápida a secciones principales

### 3. **Autenticación**
- **Login** (`/login`): Formulario de inicio de sesión con Google OAuth
- **Register** (`/register`): Formulario de registro de usuarios

### 4. **Gestión (Management)**
- **Portfolio** (`/portfolio`): Galería de proyectos destacados
- **Projects** (`/projects`): Lista completa de proyectos
- **Users** (`/users`): Tabla de gestión de usuarios

### 5. **Servicios**
- **Consulting** (`/consulting`): Servicios de consultoría disponibles

## 🔄 Sistema de Comunicación entre Componentes

### Servicio de Comunicación (CommunicationService)

Ubicación: `src/app/services/communication.service.ts`

#### Métodos disponibles:

```typescript
// Enviar mensajes generales
sendMessage(message: any): void

// Gestionar datos de usuario
setUserData(data: any): void
getUserData(): Observable<any>

// Notificar cambios de navegación
setNavigation(route: string): void
getNavigation(): Observable<string>

// Limpiar datos
clearData(): void
```

#### Cómo usar en componentes:

```typescript
import { Component, OnInit } from '@angular/core';
import { CommunicationService } from './services/communication.service';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent implements OnInit {
  
  constructor(private communicationService: CommunicationService) {}
  
  ngOnInit() {
    // Escuchar datos de usuario
    this.communicationService.userData$.subscribe(userData => {
      console.log('Datos del usuario:', userData);
    });
  }
  
  // Enviar datos
  sendData() {
    this.communicationService.setUserData({
      name: 'Ramon',
      email: 'ramon@example.com'
    });
  }
}
```

## 🎨 Sistema de Estilos Global

### Ubicación: `src/styles.scss`

#### Variables de color:
```scss
$primary-color: #3498db;      // Azul principal
$secondary-color: #2c3e50;    // Gris oscuro
$success-color: #27ae60;      // Verde
$danger-color: #e74c3c;       // Rojo
$light-bg: #ecf0f1;           // Fondo claro
```

#### Clases de botones disponibles:

```html
<!-- Botón primario (azul) -->
<button class="btn btn-primary">Click me</button>

<!-- Botón secundario (gris) -->
<button class="btn btn-secondary">Click me</button>

<!-- Botón de éxito (verde) -->
<button class="btn btn-success">Click me</button>

<!-- Botón outline (borde) -->
<button class="btn btn-outline">Click me</button>

<!-- Botón pequeño -->
<button class="btn btn-small">Click me</button>
```

## 🔗 Navegación con RouterLink

Todos los componentes están configurados para usar `RouterLink` y `RouterLinkActive`:

```html
<!-- Enlace básico -->
<a routerLink="/portfolio">Mi Portafolio</a>

<!-- Enlace con clase activa -->
<a routerLink="/projects" routerLinkActive="active">Proyectos</a>

<!-- Enlace exact (exacto) -->
<a routerLink="/" 
   routerLinkActive="active" 
   [routerLinkActiveOptions]="{exact: true}">
  Home
</a>
```

## 📱 Diseño Responsive

Todos los componentes están diseñados para ser responsive con breakpoints en:
- **768px**: Cambios en navbar, botones y grillas

## 🚀 Características de Conexión

### 1. **Navegación Global**
- Barra de navegación visible en todas las páginas
- Enlaces activos resaltados automáticamente
- Navegación intuitiva y consistente

### 2. **Botones de Navegación Contextuales**
Cada página contiene botones que enlazan con otras secciones relacionadas:
- Home → Portfolio, Proyectos, Consultoría
- Portfolio → Proyectos, Home
- Formularios → Registro, Login, Home
- Etc.

### 3. **Intercambio de Datos**
El servicio `CommunicationService` permite:
- Compartir datos de usuario entre componentes
- Notificar cambios de ruta
- Enviar mensajes generales entre componentes

## 📝 Ejemplo de Flujo de Navegación

1. Usuario abre la aplicación → Ve **Home**
2. Hace clic en "View Portfolio" → Va a **/portfolio**
3. Ve proyectos destacados → Puede hacer clic en "View All Projects" → Va a **/projects**
4. En Projects puede ver detalles → "Back to Portfolio" o "Home"
5. En cualquier momento puede usar la barra de navegación global

## ⚙️ Configuración

### app.routes.ts
```typescript
export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'users', component: Users},
    {path: 'portfolio', component: Portfolio},
    {path: 'projects', component: Projects},
    {path: 'consulting', component: Consulting}
];
```

### app.ts
El componente raíz incluye el Header:
```typescript
imports: [RouterOutlet, Header]
```

En `app.html`:
```html
<app-header></app-header>
<router-outlet />
```

## 🔐 Seguridad

- El servicio de comunicación se proporciona en `root`, haciendo que sea un singleton
- Los datos de usuario pueden ser protegidos con guards de ruta si es necesario
- Firebase Auth está integrado en el componente Login

## 🐛 Debugging

Para debugging del sistema de navegación:

```typescript
// En cualquier componente
constructor(private router: Router) {}

// Navegar programáticamente
this.router.navigate(['/portfolio']);

// Obtener ruta actual
this.router.url // retorna la ruta actual
```

## 📞 Soporte

Para más información sobre Angular routing:
- [Angular Router Documentation](https://angular.io/guide/router)
- [Angular Services](https://angular.io/guide/architecture-services)

---

**Versión**: 1.0.0  
**Autor**: Ramon Serrano  
**Fecha**: Diciembre 2024
