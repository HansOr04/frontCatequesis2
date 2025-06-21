# 🎉 Sistema de Catequesis - Frontend

Frontend desarrollado en **Next.js 14** con **Tailwind CSS v3** para el Sistema de Gestión de Catequesis. Compatible con ambos backends (SQL Server y MongoDB).

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [🔧 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [📁 Estructura de Carpetas](#-estructura-de-carpetas)
- [⚙️ Configuración de Backend](#️-configuración-de-backend)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🌍 Variables de Entorno](#-variables-de-entorno)
- [🎨 Sistema de Diseño](#-sistema-de-diseño)
- [📱 Módulos del Sistema](#-módulos-del-sistema)
- [🔐 Autenticación y Roles](#-autenticación-y-roles)
- [🚀 Scripts Disponibles](#-scripts-disponibles)
- [📦 Dependencias](#-dependencias)
- [🔄 API Endpoints](#-api-endpoints)

## 🏗️ Arquitectura del Proyecto

```
SISTEMA DE CATEQUESIS
├── 🖥️ Frontend (Next.js + Tailwind)
│   ├── Dashboard Principal
│   ├── Gestión de Usuarios
│   ├── Administración de Parroquias
│   ├── Control de Catequizandos
│   ├── Gestión de Grupos y Niveles
│   ├── Sistema de Asistencia
│   └── Generación de Certificados
│
├── 🗄️ Backend SQL Server (Puerto 3000)
│   ├── Express.js + MSSQL
│   ├── JWT Authentication
│   ├── API REST Completa
│   └── Middleware de Validación
│
└── 🗄️ Backend MongoDB (Puerto 3001)
    ├── Express.js + Mongoose
    ├── JWT Authentication
    ├── API REST Completa
    └── Middleware de Validación
```

## 🔧 Tecnologías Utilizadas

### Frontend Core
- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS v3** - Framework de CSS utility-first

### Librerías de UI y UX
- **@heroicons/react** - Iconos oficiales
- **@headlessui/react** - Componentes accesibles
- **framer-motion** - Animaciones fluidas
- **react-hook-form** - Manejo de formularios
- **react-query/tanstack** - Gestión de estado servidor

### Utilidades y Herramientas
- **axios** - Cliente HTTP
- **date-fns** - Manipulación de fechas
- **js-cookie** - Gestión de cookies
- **react-hot-toast** - Notificaciones
- **recharts** - Gráficos y visualización de datos

## 📁 Estructura de Carpetas

```
catequesis-frontend/
├── 📂 src/
│   ├── 📂 app/                     # App Router de Next.js 14
│   │   ├── 📂 (dashboard)/         # Grupo de rutas privadas
│   │   │   ├── 📂 catequizandos/
│   │   │   ├── 📂 catequistas/
│   │   │   ├── 📂 grupos/
│   │   │   ├── 📂 asistencia/
│   │   │   ├── 📂 certificados/
│   │   │   └── layout.tsx
│   │   ├── 📂 auth/                # Autenticación
│   │   │   ├── 📂 login/
│   │   │   └── layout.tsx
│   │   ├── 📂 api/                 # API Routes
│   │   └── layout.tsx              # Layout principal
│   │
│   ├── 📂 components/              # Componentes reutilizables
│   │   ├── 📂 ui/                  # Componentes base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Select.tsx
│   │   ├── 📂 layout/              # Componentes de layout
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── 📂 forms/               # Formularios específicos
│   │   │   ├── CatequizandoForm.tsx
│   │   │   ├── GrupoForm.tsx
│   │   │   └── AsistenciaForm.tsx
│   │   └── 📂 charts/              # Gráficos y visualizaciones
│   │       ├── DashboardStats.tsx
│   │       └── AsistenciaChart.tsx
│   │
│   ├── 📂 lib/                     # Librerías y utilidades
│   │   ├── 📂 api/                 # Configuración de APIs
│   │   │   ├── client.ts           # Cliente HTTP
│   │   │   ├── endpoints.ts        # Endpoints disponibles
│   │   │   └── adapters/          # Adaptadores de backend
│   │   │       ├── sqlserver.ts
│   │   │       └── mongodb.ts
│   │   ├── 📂 auth/                # Autenticación
│   │   │   ├── context.tsx
│   │   │   └── middleware.ts
│   │   ├── 📂 hooks/               # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── 📂 utils/               # Utilidades generales
│   │   │   ├── constants.ts
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── date.ts
│   │   └── 📂 types/               # Tipos TypeScript
│   │       ├── auth.ts
│   │       ├── api.ts
│   │       └── models.ts
│   │
│   ├── 📂 styles/                  # Estilos globales
│   │   ├── globals.css
│   │   └── components.css
│   │
│   └── 📂 public/                  # Archivos estáticos
│       ├── 📂 images/
│       ├── 📂 icons/
│       └── favicon.ico
│
├── 📄 .env.local                   # Variables de entorno local
├── 📄 .env.example                 # Ejemplo de variables
├── 📄 tailwind.config.js           # Configuración de Tailwind
├── 📄 next.config.js               # Configuración de Next.js
├── 📄 tsconfig.json                # Configuración de TypeScript
└── 📄 package.json                 # Dependencias y scripts
```

## ⚙️ Configuración de Backend

El frontend está diseñado para trabajar con **ambos backends** a través de un sistema de adaptadores:

### 🗄️ Backend SQL Server
- **Puerto:** 3000
- **Base de datos:** SQL Server
- **Endpoints:** `/api/auth`, `/api/parroquias`, `/api/catequizandos`, etc.

### 🗄️ Backend MongoDB  
- **Puerto:** 3001
- **Base de datos:** MongoDB Atlas
- **Endpoints:** `/api/auth`, `/api/usuarios`, `/api/parroquias`, etc.

### 🔄 Sistema de Adaptadores
```typescript
// lib/api/adapters/sqlserver.ts
export const sqlServerAdapter = {
  baseURL: 'http://localhost:3000',
  endpoints: {
    auth: '/api/auth',
    catequizandos: '/api/catequizandos',
    // ...más endpoints
  }
}

// lib/api/adapters/mongodb.ts
export const mongoAdapter = {
  baseURL: 'http://localhost:3001',
  endpoints: {
    auth: '/api/auth',
    usuarios: '/api/usuarios',
    catequizandos: '/api/catequizandos',
    // ...más endpoints
  }
}
```

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Git**
- **PowerShell** (Windows)

### 🛠️ Pasos de Instalación

#### 1. Crear el proyecto
```powershell
# Crear proyecto Next.js con TypeScript y Tailwind
npx create-next-app@latest catequesis-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navegar al directorio
cd catequesis-frontend
```

#### 2. Instalar dependencias adicionales
```powershell
# Dependencias principales
npm install @heroicons/react @headlessui/react framer-motion react-hook-form @hookform/resolvers zod

# Cliente HTTP y gestión de estado
npm install axios @tanstack/react-query js-cookie

# Utilidades de fecha y notificaciones
npm install date-fns react-hot-toast

# Gráficos y visualización
npm install recharts

# Tipos para TypeScript
npm install -D @types/js-cookie
```

#### 3. Configurar variables de entorno
```powershell
# Copiar archivo de ejemplo
copy .env.example .env.local

# Editar variables de entorno
notepad .env.local
```

#### 4. Configurar Tailwind CSS
```powershell
# El archivo tailwind.config.js ya viene configurado
# Personalizar según las necesidades del proyecto
```

#### 5. Iniciar el servidor de desarrollo
```powershell
npm run dev
```

## 🌍 Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# ===============================================
# CONFIGURACIÓN DEL FRONTEND
# ===============================================

# Configuración general
NEXT_PUBLIC_APP_NAME="Sistema de Catequesis"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_ENVIRONMENT="development"

# ===============================================
# CONFIGURACIÓN DE BACKENDS
# ===============================================

# Backend principal (SQL Server o MongoDB)
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_TYPE="sqlserver"  # "sqlserver" o "mongodb"

# Backend SQL Server
NEXT_PUBLIC_SQLSERVER_URL="http://localhost:3000"
NEXT_PUBLIC_SQLSERVER_API_VERSION="v1"

# Backend MongoDB
NEXT_PUBLIC_MONGODB_URL="http://localhost:3001"
NEXT_PUBLIC_MONGODB_API_VERSION="v1"

# ===============================================
# AUTENTICACIÓN
# ===============================================

# JWT Configuration
NEXT_PUBLIC_JWT_EXPIRATION="24h"
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRATION="7d"

# Cookies
NEXT_PUBLIC_COOKIE_NAME="catequesis_token"
NEXT_PUBLIC_COOKIE_SECURE="false"  # true en producción
NEXT_PUBLIC_COOKIE_SAME_SITE="lax"

# ===============================================
# CONFIGURACIÓN DE UI
# ===============================================

# Paginación
NEXT_PUBLIC_DEFAULT_PAGE_SIZE="10"
NEXT_PUBLIC_MAX_PAGE_SIZE="100"

# Archivos
NEXT_PUBLIC_MAX_FILE_SIZE="5242880"  # 5MB en bytes
NEXT_PUBLIC_ALLOWED_IMAGE_TYPES="jpg,jpeg,png,gif"
NEXT_PUBLIC_ALLOWED_DOC_TYPES="pdf,doc,docx"

# ===============================================
# CONFIGURACIÓN DE NOTIFICACIONES
# ===============================================

# Toast notifications
NEXT_PUBLIC_TOAST_DURATION="4000"
NEXT_PUBLIC_TOAST_POSITION="top-right"

# ===============================================
# CONFIGURACIÓN DE DESARROLLO
# ===============================================

# Debug
NEXT_PUBLIC_DEBUG_MODE="true"
NEXT_PUBLIC_SHOW_LOGS="true"

# API Timeouts (en milisegundos)
NEXT_PUBLIC_API_TIMEOUT="30000"
NEXT_PUBLIC_UPLOAD_TIMEOUT="60000"
```

## 🎨 Sistema de Diseño

### 🎨 Paleta de Colores
```css
/* tailwind.config.js - Configuración personalizada */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Colores principales del sistema
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',   // Color principal
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',   // Azul marino principal
          950: '#172554'
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Naranja principal para acciones
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    }
  }
}
```

### 📱 Componentes de UI Base
- **Cards**: Contenedores con shadow suave
- **Buttons**: Variantes primary, secondary, success, warning, error
- **Forms**: Inputs, selects, textareas con validación visual
- **Tables**: Responsive con paginación
- **Modals**: Overlay con animaciones suaves
- **Navigation**: Sidebar colapsible + navbar superior

## 📱 Módulos del Sistema

### 🏠 Dashboard Principal
- **Métricas generales**: Catequizandos activos, catequistas, grupos, certificados
- **Últimas inscripciones**: Lista de inscripciones recientes
- **Estadísticas por parroquia**: Gráficos de distribución
- **Acciones rápidas**: Botones para funciones principales

### 👥 Gestión de Catequizandos
- **Lista con filtros**: Por parroquia, nivel, estado
- **Formulario de registro**: Datos personales, representantes, padrinos
- **Historial de inscripciones**: Por catequizando
- **Gestión de documentos**: Carga de archivos

### 👨‍🏫 Gestión de Catequistas
- **Directorio de catequistas**: Con información de contacto
- **Asignación a grupos**: Gestión de responsabilidades
- **Horarios y disponibilidad**: Programación de clases

### 📚 Grupos y Niveles
- **Gestión de niveles**: Configuración de catequesis
- **Administración de grupos**: Horarios, catequistas, salones
- **Inscripciones por grupo**: Lista de catequizandos

### ✅ Control de Asistencia
- **Registro individual**: Por catequizando y fecha
- **Registro masivo**: Por grupo completo
- **Reportes de asistencia**: Estadísticas y gráficos
- **Notificaciones de ausencia**: Alertas automáticas

### 🎓 Gestión de Certificados
- **Emisión individual**: Por catequizando aprobado
- **Emisión masiva**: Por nivel o parroquia
- **Plantillas personalizables**: Diseño de certificados
- **Historial de emisiones**: Registro completo

## 🔐 Autenticación y Roles

### 🔑 Sistema de Autenticación
- **JWT Tokens**: Autenticación stateless
- **Refresh Tokens**: Renovación automática
- **Middleware de protección**: Rutas privadas
- **Logout seguro**: Limpieza de tokens

### 👤 Roles de Usuario
1. **Admin**: Acceso completo al sistema
2. **Párroco**: Gestión de su parroquia
3. **Secretaria**: Operaciones administrativas
4. **Catequista**: Consulta y registro de asistencia

### 🛡️ Protección de Rutas
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('catequesis_token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard')

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
```

## 🚀 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 🔧 Comandos PowerShell

```powershell
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build           # Construye para producción
npm run start           # Inicia servidor de producción

# Calidad de código
npm run lint            # Verifica ESLint
npm run lint:fix        # Corrige errores de ESLint
npm run type-check      # Verifica tipos TypeScript
npm run format          # Formatea código con Prettier

# Testing
npm run test            # Ejecuta tests
npm run test:watch      # Tests en modo watch
npm run test:coverage   # Tests con cobertura
```

## 📦 Dependencias

### 🔧 Dependencias Principales
```json
{
  "next": "14.0.0",
  "react": "18.0.0",
  "react-dom": "18.0.0",
  "typescript": "5.0.0",
  "@heroicons/react": "^2.0.18",
  "@headlessui/react": "^1.7.17",
  "framer-motion": "^10.16.4",
  "react-hook-form": "^7.47.0",
  "@hookform/resolvers": "^3.3.2",
  "zod": "^3.22.4",
  "axios": "^1.5.1",
  "@tanstack/react-query": "^5.0.0",
  "js-cookie": "^3.0.5",
  "date-fns": "^2.30.0",
  "react-hot-toast": "^2.4.1",
  "recharts": "^2.8.0"
}
```

### 🛠️ Dependencias de Desarrollo
```json
{
  "@types/node": "20.0.0",
  "@types/react": "18.0.0",
  "@types/react-dom": "18.0.0",
  "@types/js-cookie": "^3.0.6",
  "eslint": "8.0.0",
  "eslint-config-next": "14.0.0",
  "prettier": "^3.0.0",
  "tailwindcss": "3.3.0",
  "autoprefixer": "10.0.0",
  "postcss": "8.0.0"
}
```

## 🔄 API Endpoints

### 🔐 Autenticación
```typescript
// Endpoints comunes para ambos backends
POST /api/auth/login      // Iniciar sesión
POST /api/auth/logout     // Cerrar sesión
GET  /api/auth/profile    // Obtener perfil
POST /api/auth/refresh    // Renovar token
```

### 👥 Usuarios/Catequizandos
```typescript
// SQL Server
GET    /api/catequizandos              // Obtener todos
GET    /api/catequizandos/:id          // Obtener por ID
POST   /api/catequizandos              // Crear nuevo
PUT    /api/catequizandos/:id          // Actualizar
DELETE /api/catequizandos/:id          // Eliminar

// MongoDB
GET    /api/usuarios                   // Obtener todos
GET    /api/catequizandos              // Obtener catequizandos
// ... misma estructura
```

### 🏛️ Parroquias
```typescript
GET    /api/parroquias                 // Obtener todas
GET    /api/parroquias/:id             // Obtener por ID
POST   /api/parroquias                 // Crear nueva
PUT    /api/parroquias/:id             // Actualizar
DELETE /api/parroquias/:id             // Eliminar
GET    /api/parroquias/:id/stats       // Estadísticas
```

### 📚 Grupos y Niveles
```typescript
GET    /api/grupos                     // Obtener todos
GET    /api/grupos/parroquia/:id       // Por parroquia
GET    /api/niveles                    // Obtener niveles
GET    /api/niveles/ordenados          // Niveles ordenados
```

### ✅ Asistencia
```typescript
GET    /api/asistencias                // Obtener todas
POST   /api/asistencias                // Registrar individual
POST   /api/asistencias/grupo/:id      // Registrar por grupo
GET    /api/asistencias/reporte        // Generar reporte
GET    /api/asistencias/stats          // Estadísticas
```

### 🎓 Certificados
```typescript
GET    /api/certificados               // Obtener todos
POST   /api/certificados               // Emitir individual
POST   /api/certificados/masiva        // Emisión masiva
GET    /api/certificados/:id/download  // Descargar PDF
```

---

## 📝 Próximos Pasos

1. **Ejecutar comandos de instalación** en PowerShell
2. **Configurar variables de entorno** según tu backend preferido
3. **Iniciar ambos backends** (SQL Server en :3000, MongoDB en :3001)
4. **Ejecutar el frontend** con `npm run dev`
5. **Acceder a** `http://localhost:3000` para verificar funcionamiento

El frontend detectará automáticamente qué backend usar basándose en la variable `NEXT_PUBLIC_BACKEND_TYPE` y realizará las adaptaciones necesarias en las llamadas a la API.

¿Te gustaría que proceda con la creación de algún componente específico o configuración adicional?
# 📋 Plan de Creación de Archivos - Paso a Paso

## 🔧 **FASE 1: Configuración Base** (Crear primero)

### 1.1 Variables de Entorno
```
.env.local
.env.example
```

### 1.2 Configuraciones
```
tailwind.config.js
next.config.js
tsconfig.json
```

### 1.3 Archivos de Configuración de Proyecto
```
.gitignore
README.md
package.json (ya existe, solo modificar)
```

---

## 📁 **FASE 2: Estructura Base de Carpetas** (Crear carpetas vacías)

### 2.1 Carpetas principales
```
src/lib/
src/lib/types/
src/lib/utils/
src/lib/api/
src/lib/hooks/
src/lib/auth/
src/components/
src/components/ui/
src/components/layout/
src/components/forms/
src/components/charts/
```

---

## 🏗️ **FASE 3: Tipos y Constantes** (Base del sistema)

### 3.1 Tipos TypeScript
```
src/lib/types/auth.ts
src/lib/types/api.ts
src/lib/types/models.ts
src/lib/types/ui.ts
```

### 3.2 Constantes y Utilidades
```
src/lib/utils/constants.ts
src/lib/utils/formatters.ts
src/lib/utils/validators.ts
src/lib/utils/date.ts
src/lib/utils/cn.ts
```

---

## 🌐 **FASE 4: Configuración de APIs** (Conexión con backends)

### 4.1 Cliente HTTP y Adaptadores
```
src/lib/api/client.ts
src/lib/api/endpoints.ts
src/lib/api/adapters/sqlserver.ts
src/lib/api/adapters/mongodb.ts
```

### 4.2 Servicios API
```
src/lib/api/services/auth.ts
src/lib/api/services/usuarios.ts
src/lib/api/services/catequizandos.ts
src/lib/api/services/parroquias.ts
src/lib/api/services/grupos.ts
src/lib/api/services/asistencia.ts
src/lib/api/services/certificados.ts
```

---

## 🔐 **FASE 5: Sistema de Autenticación** (Crítico)

### 5.1 Autenticación
```
src/lib/auth/context.tsx
src/lib/auth/provider.tsx
src/lib/auth/middleware.ts
middleware.ts (en raíz)
```

### 5.2 Custom Hooks
```
src/lib/hooks/useAuth.ts
src/lib/hooks/useApi.ts
src/lib/hooks/useLocalStorage.ts
src/lib/hooks/useDebounce.ts
```

---

## 🎨 **FASE 6: Estilos Globales** (Antes de componentes)

### 6.1 CSS
```
src/styles/globals.css
src/styles/components.css
```

---

## 🧩 **FASE 7: Componentes Base UI** (Fundamentales)

### 7.1 Componentes UI Primitivos
```
src/components/ui/Button.tsx
src/components/ui/Input.tsx
src/components/ui/Card.tsx
src/components/ui/Modal.tsx
src/components/ui/Select.tsx
src/components/ui/Table.tsx
src/components/ui/Badge.tsx
src/components/ui/Loading.tsx
src/components/ui/Alert.tsx
src/components/ui/Tooltip.tsx
```

---

## 🏠 **FASE 8: Layout Principal** (Estructura de páginas)

### 8.1 Componentes de Layout
```
src/components/layout/RootLayout.tsx
src/components/layout/Navbar.tsx
src/components/layout/Sidebar.tsx
src/components/layout/Footer.tsx
src/components/layout/MobileMenu.tsx
src/components/layout/UserMenu.tsx
```

---

## 📱 **FASE 9: Layouts de Next.js** (App Router)

### 9.1 Layouts principales
```
src/app/layout.tsx
src/app/globals.css
src/app/page.tsx
```

### 9.2 Layout de autenticación
```
src/app/auth/layout.tsx
src/app/auth/page.tsx
```

### 9.3 Layout del dashboard
```
src/app/(dashboard)/layout.tsx
src/app/(dashboard)/page.tsx
src/app/(dashboard)/loading.tsx
src/app/(dashboard)/error.tsx
```

---

## 🔑 **FASE 10: Páginas de Autenticación** (Acceso al sistema)

### 10.1 Autenticación
```
src/app/auth/login/page.tsx
src/app/auth/login/loading.tsx
src/app/auth/logout/page.tsx
```

---

## 📊 **FASE 11: Dashboard Principal** (Página inicial)

### 11.1 Dashboard
```
src/app/(dashboard)/dashboard/page.tsx
src/components/charts/DashboardStats.tsx
src/components/charts/StatsCard.tsx
src/components/charts/RecentActivities.tsx
src/components/charts/QuickActions.tsx
```

---

## 👥 **FASE 12: Módulo de Catequizandos** (Funcionalidad principal)

### 12.1 Páginas
```
src/app/(dashboard)/catequizandos/page.tsx
src/app/(dashboard)/catequizandos/nuevo/page.tsx
src/app/(dashboard)/catequizandos/[id]/page.tsx
src/app/(dashboard)/catequizandos/[id]/editar/page.tsx
src/app/(dashboard)/catequizandos/loading.tsx
```

### 12.2 Componentes específicos
```
src/components/forms/CatequizandoForm.tsx
src/components/forms/CatequizandoSearch.tsx
src/components/ui/CatequizandoCard.tsx
src/components/ui/CatequizandoTable.tsx
```

---

## 👨‍🏫 **FASE 13: Módulo de Catequistas** (Gestión de personal)

### 13.1 Páginas
```
src/app/(dashboard)/catequistas/page.tsx
src/app/(dashboard)/catequistas/nuevo/page.tsx
src/app/(dashboard)/catequistas/[id]/page.tsx
```

### 13.2 Componentes
```
src/components/forms/CatequistaForm.tsx
src/components/ui/CatequistaCard.tsx
```

---

## 📚 **FASE 14: Módulo de Grupos** (Organización)

### 14.1 Páginas
```
src/app/(dashboard)/grupos/page.tsx
src/app/(dashboard)/grupos/nuevo/page.tsx
src/app/(dashboard)/grupos/[id]/page.tsx
src/app/(dashboard)/grupos/[id]/asistencia/page.tsx
```

### 14.2 Componentes
```
src/components/forms/GrupoForm.tsx
src/components/ui/GrupoCard.tsx
src/components/ui/GrupoTable.tsx
```

---

## ✅ **FASE 15: Módulo de Asistencia** (Control diario)

### 15.1 Páginas
```
src/app/(dashboard)/asistencia/page.tsx
src/app/(dashboard)/asistencia/registrar/page.tsx
src/app/(dashboard)/asistencia/reportes/page.tsx
```

### 15.2 Componentes
```
src/components/forms/AsistenciaForm.tsx
src/components/forms/AsistenciaMasiva.tsx
src/components/charts/AsistenciaChart.tsx
src/components/ui/AsistenciaTable.tsx
```

---

## 🎓 **FASE 16: Módulo de Certificados** (Emisión)

### 16.1 Páginas
```
src/app/(dashboard)/certificados/page.tsx
src/app/(dashboard)/certificados/emitir/page.tsx
src/app/(dashboard)/certificados/masivo/page.tsx
src/app/(dashboard)/certificados/plantillas/page.tsx
```

### 16.2 Componentes
```
src/components/forms/CertificadoForm.tsx
src/components/forms/EmisionMasiva.tsx
src/components/ui/CertificadoPreview.tsx
```

---

## 🏛️ **FASE 17: Módulos Administrativos** (Configuración)

### 17.1 Parroquias
```
src/app/(dashboard)/administracion/parroquias/page.tsx
src/app/(dashboard)/administracion/parroquias/nueva/page.tsx
src/components/forms/ParroquiaForm.tsx
```

### 17.2 Niveles
```
src/app/(dashboard)/administracion/niveles/page.tsx
src/app/(dashboard)/administracion/niveles/nuevo/page.tsx
src/components/forms/NivelForm.tsx
```

### 17.3 Usuarios
```
src/app/(dashboard)/administracion/usuarios/page.tsx
src/app/(dashboard)/administracion/usuarios/nuevo/page.tsx
src/components/forms/UsuarioForm.tsx
```

---

## ⚙️ **FASE 18: Configuración de Usuario** (Perfil)

### 18.1 Cuenta
```
src/app/(dashboard)/cuenta/page.tsx
src/app/(dashboard)/cuenta/perfil/page.tsx
src/app/(dashboard)/cuenta/configuracion/page.tsx
```

### 18.2 Componentes
```
src/components/forms/PerfilForm.tsx
src/components/forms/CambiarPassword.tsx
```

---

## 🔧 **FASE 19: API Routes** (Si necesario)

### 19.1 API Routes de Next.js
```
src/app/api/auth/route.ts
src/app/api/upload/route.ts
src/app/api/export/route.ts
```

---

## 📱 **FASE 20: Componentes Avanzados** (Funcionalidades extra)

### 20.1 Componentes especializados
```
src/components/ui/DataExport.tsx
src/components/ui/FileUpload.tsx
src/components/ui/SearchFilter.tsx
src/components/ui/Pagination.tsx
src/components/ui/BreadcrumbNav.tsx
src/components/charts/AdvancedCharts.tsx
```

---

## 🧪 **FASE 21: Testing** (Opcional)

### 21.1 Tests
```
__tests__/components/Button.test.tsx
__tests__/pages/login.test.tsx
__tests__/api/auth.test.ts
jest.config.js
```

---

## 📋 **RESUMEN DEL ORDEN:**

1. **Configuración** → Variables y configs
2. **Tipos** → Definiciones TypeScript  
3. **API** → Conexión con backends
4. **Auth** → Sistema de autenticación
5. **UI Base** → Componentes primitivos
6. **Layout** → Estructura de páginas
7. **Páginas Base** → Login y dashboard
8. **Módulos** → Por orden de importancia
9. **Avanzado** → Funcionalidades extra

**🎯 Consejo:** Crear en este orden te permitirá **probar cada fase** antes de continuar con la siguiente, evitando errores de dependencias.

¿Quieres que empecemos con alguna fase específica o prefieres que te dé el contenido de los primeros archivos de configuración?