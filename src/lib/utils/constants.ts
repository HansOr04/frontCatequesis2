// ===============================================
// CONSTANTES DEL SISTEMA DE CATEQUESIS
// ===============================================

import type { UserRole, EstadoGeneral, TipoDocumento, Genero, EstadoCivil } from '../types/models';
import type { ColorVariant, Size } from '../types/ui';

// ===============================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ===============================================

export const APP_CONFIG = {
  name: 'Sistema de Catequesis',
  version: '1.0.0',
  description: 'Sistema de gestión integral para catequesis parroquial',
  author: 'Tu Nombre',
  email: 'admin@catequesis.com',
  website: 'https://catequesis.com',
} as const;

// ===============================================
// CONFIGURACIÓN DE BACKEND
// ===============================================

export const BACKEND_CONFIG = {
  sqlserver: {
    baseURL: process.env.NEXT_PUBLIC_SQLSERVER_URL || 'http://localhost:3000',
    timeout: 30000,
    endpoints: {
      auth: '/api/auth',
      parroquias: '/api/parroquias',
      niveles: '/api/niveles',
      catequizandos: '/api/catequizandos',
      grupos: '/api/grupos',
      inscripciones: '/api/inscripciones',
      asistencias: '/api/asistencias',
      usuarios: '/api/usuarios',
    },
  },
  mongodb: {
    baseURL: process.env.NEXT_PUBLIC_MONGODB_URL || 'http://localhost:3001',
    timeout: 30000,
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      parroquias: '/api/parroquias',
      niveles: '/api/niveles',
      catequizandos: '/api/catequizandos',
      grupos: '/api/grupos',
      inscripciones: '/api/inscripciones',
      asistencias: '/api/asistencias',
    },
  },
} as const;

// ===============================================
// ROLES Y PERMISOS
// ===============================================

export const USER_ROLES: Record<UserRole, { label: string; description: string; color: ColorVariant }> = {
  admin: {
    label: 'Administrador',
    description: 'Acceso completo al sistema',
    color: 'error',
  },
  parroco: {
    label: 'Párroco',
    description: 'Gestión completa de su parroquia',
    color: 'primary',
  },
  secretaria: {
    label: 'Secretaria',
    description: 'Operaciones administrativas',
    color: 'info',
  },
  catequista: {
    label: 'Catequista',
    description: 'Consulta y registro de asistencia',
    color: 'success',
  },
  consulta: {
    label: 'Consulta',
    description: 'Solo consulta de información',
    color: 'neutral',
  },
} as const;

export const PERMISSIONS = {
  // Usuarios
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_ADMIN: 'users:admin',

  // Catequizandos
  CATEQUIZANDOS_CREATE: 'catequizandos:create',
  CATEQUIZANDOS_READ: 'catequizandos:read',
  CATEQUIZANDOS_UPDATE: 'catequizandos:update',
  CATEQUIZANDOS_DELETE: 'catequizandos:delete',

  // Grupos
  GRUPOS_CREATE: 'grupos:create',
  GRUPOS_READ: 'grupos:read',
  GRUPOS_UPDATE: 'grupos:update',
  GRUPOS_DELETE: 'grupos:delete',

  // Asistencia
  ASISTENCIA_CREATE: 'asistencia:create',
  ASISTENCIA_READ: 'asistencia:read',
  ASISTENCIA_UPDATE: 'asistencia:update',
  ASISTENCIA_DELETE: 'asistencia:delete',

  // Certificados
  CERTIFICADOS_CREATE: 'certificados:create',
  CERTIFICADOS_READ: 'certificados:read',
  CERTIFICADOS_EMIT: 'certificados:emit',
  CERTIFICADOS_DELETE: 'certificados:delete',

  // Administración
  ADMIN_PARROQUIAS: 'admin:parroquias',
  ADMIN_NIVELES: 'admin:niveles',
  ADMIN_CONFIGURACION: 'admin:configuracion',
  ADMIN_REPORTES: 'admin:reportes',
} as const;

// ===============================================
// ESTADOS Y TIPOS
// ===============================================

export const ESTADOS_GENERALES: Record<EstadoGeneral, { label: string; color: ColorVariant }> = {
  activo: { label: 'Activo', color: 'success' },
  inactivo: { label: 'Inactivo', color: 'neutral' },
  pendiente: { label: 'Pendiente', color: 'warning' },
  completado: { label: 'Completado', color: 'primary' },
  cancelado: { label: 'Cancelado', color: 'error' },
} as const;

export const TIPOS_DOCUMENTO: Record<TipoDocumento, { label: string; pattern?: string }> = {
  cedula: { label: 'Cédula', pattern: '^[0-9]{10}$' },
  pasaporte: { label: 'Pasaporte', pattern: '^[A-Z0-9]{6,9}$' },
  ruc: { label: 'RUC', pattern: '^[0-9]{13}$' },
  documento_extranjero: { label: 'Documento Extranjero' },
} as const;

export const GENEROS: Record<Genero, { label: string; abbr: string }> = {
  masculino: { label: 'Masculino', abbr: 'M' },
  femenino: { label: 'Femenino', abbr: 'F' },
  otro: { label: 'Otro', abbr: 'O' },
  no_especifica: { label: 'No especifica', abbr: 'N/E' },
} as const;

export const ESTADOS_CIVILES: Record<EstadoCivil, { label: string }> = {
  soltero: { label: 'Soltero(a)' },
  casado: { label: 'Casado(a)' },
  divorciado: { label: 'Divorciado(a)' },
  viudo: { label: 'Viudo(a)' },
  union_libre: { label: 'Unión libre' },
} as const;

// ===============================================
// CONFIGURACIÓN DE UI
// ===============================================

export const UI_CONFIG = {
  // Tamaños
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  
  // Espaciado
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },

  // Radios de borde
  radius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

// ===============================================
// CONFIGURACIÓN DE PAGINACIÓN
// ===============================================

export const PAGINATION_CONFIG = {
  defaultPage: 1,
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  maxPageSize: 100,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: true,
} as const;

// ===============================================
// CONFIGURACIÓN DE ARCHIVOS
// ===============================================

export const FILE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'],
} as const;

// ===============================================
// CONFIGURACIÓN DE VALIDACIÓN
// ===============================================

export const VALIDATION_CONFIG = {
  username: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9._-]+$/,
  },
  password: {
    minLength: 6,
    maxLength: 100,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  telefono: {
    pattern: /^[\d\-\s\+\(\)]+$/,
    minLength: 7,
    maxLength: 20,
  },
  nombres: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
  documento: {
    minLength: 6,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9\-]+$/,
  },
} as const;

// ===============================================
// CONFIGURACIÓN DE FECHAS
// ===============================================

export const DATE_CONFIG = {
  formats: {
    display: 'dd/MM/yyyy',
    displayWithTime: 'dd/MM/yyyy HH:mm',
    api: 'yyyy-MM-dd',
    apiWithTime: 'yyyy-MM-dd HH:mm:ss',
    input: 'yyyy-MM-dd',
  },
  locales: {
    es: 'es-ES',
    en: 'en-US',
  },
  defaultLocale: 'es-ES',
} as const;

// ===============================================
// CONFIGURACIÓN DE NOTIFICACIONES
// ===============================================

export const NOTIFICATION_CONFIG = {
  duration: {
    success: 4000,
    error: 6000,
    warning: 5000,
    info: 4000,
  },
  position: 'top-right',
  maxNotifications: 5,
} as const;

// ===============================================
// CONFIGURACIÓN DE AUTENTICACIÓN
// ===============================================

export const AUTH_CONFIG = {
  tokenKey: 'catequesis_token',
  refreshTokenKey: 'catequesis_refresh_token',
  userKey: 'catequesis_user',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
  refreshThreshold: 5 * 60 * 1000, // 5 minutos antes de expirar
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos
} as const;

// ===============================================
// RUTAS DE LA APLICACIÓN
// ===============================================

export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Catequizandos
  CATEQUIZANDOS: '/catequizandos',
  CATEQUIZANDOS_NEW: '/catequizandos/nuevo',
  CATEQUIZANDOS_DETAIL: '/catequizandos/[id]',
  CATEQUIZANDOS_EDIT: '/catequizandos/[id]/editar',

  // Catequistas
  CATEQUISTAS: '/catequistas',
  CATEQUISTAS_NEW: '/catequistas/nuevo',
  CATEQUISTAS_DETAIL: '/catequistas/[id]',

  // Grupos
  GRUPOS: '/grupos',
  GRUPOS_NEW: '/grupos/nuevo',
  GRUPOS_DETAIL: '/grupos/[id]',
  GRUPOS_ASISTENCIA: '/grupos/[id]/asistencia',

  // Asistencia
  ASISTENCIA: '/asistencia',
  ASISTENCIA_REGISTRAR: '/asistencia/registrar',
  ASISTENCIA_REPORTES: '/asistencia/reportes',

  // Certificados
  CERTIFICADOS: '/certificados',
  CERTIFICADOS_EMITIR: '/certificados/emitir',
  CERTIFICADOS_MASIVO: '/certificados/masivo',
  CERTIFICADOS_PLANTILLAS: '/certificados/plantillas',

  // Administración
  ADMIN_PARROQUIAS: '/administracion/parroquias',
  ADMIN_NIVELES: '/administracion/niveles',
  ADMIN_USUARIOS: '/administracion/usuarios',

  // Cuenta
  CUENTA: '/cuenta',
  CUENTA_PERFIL: '/cuenta/perfil',
  CUENTA_CONFIGURACION: '/cuenta/configuracion',
} as const;

// ===============================================
// MENSAJES DEL SISTEMA
// ===============================================

export const MESSAGES = {
  // Éxito
  SUCCESS: {
    LOGIN: 'Sesión iniciada correctamente',
    LOGOUT: 'Sesión cerrada correctamente',
    SAVE: 'Información guardada correctamente',
    UPDATE: 'Información actualizada correctamente',
    DELETE: 'Elemento eliminado correctamente',
    CREATED: 'Elemento creado correctamente',
  },

  // Errores
  ERROR: {
    GENERAL: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu internet',
    UNAUTHORIZED: 'No tienes permisos para esta acción',
    FORBIDDEN: 'Acceso denegado',
    NOT_FOUND: 'Elemento no encontrado',
    VALIDATION: 'Revisa los datos ingresados',
    SESSION_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente',
  },

  // Confirmaciones
  CONFIRM: {
    DELETE: '¿Estás seguro de eliminar este elemento?',
    LOGOUT: '¿Estás seguro de cerrar sesión?',
    DISCARD_CHANGES: '¿Estás seguro de descartar los cambios?',
  },

  // Estados de carga
  LOADING: {
    DEFAULT: 'Cargando...',
    SAVING: 'Guardando...',
    DELETING: 'Eliminando...',
    PROCESSING: 'Procesando...',
    UPLOADING: 'Subiendo archivo...',
  },
} as const;

// ===============================================
// CONFIGURACIÓN DE CHARTS/GRÁFICOS
// ===============================================

export const CHART_CONFIG = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#dc2626',
    info: '#0891b2',
  },
  defaultHeight: 300,
  responsive: true,
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart',
  },
} as const;

// ===============================================
// CONFIGURACIÓN DE EXPORT/IMPORT
// ===============================================

export const EXPORT_CONFIG = {
  formats: ['pdf', 'excel', 'csv'],
  maxRecords: 10000,
  defaultFilename: 'export_catequesis',
  templates: {
    catequizandos: 'catequizandos_template.xlsx',
    asistencia: 'asistencia_template.xlsx',
    certificados: 'certificados_template.pdf',
  },
} as const;

// ===============================================
// DÍAS DE LA SEMANA
// ===============================================

export const DIAS_SEMANA = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
] as const;

// ===============================================
// PROVINCIAS DE ECUADOR (Ejemplo)
// ===============================================

export const PROVINCIAS_ECUADOR = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi',
  'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja',
  'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza',
  'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos',
  'Tungurahua', 'Zamora Chinchipe'
] as const;