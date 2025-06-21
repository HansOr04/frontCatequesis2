// ===============================================
// ENDPOINTS DE LA API
// ===============================================

import type { BackendType } from '../types/api';

/**
 * Configuración de endpoints para cada backend
 */
interface EndpointConfig {
  [key: string]: {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    auth?: boolean;
    cache?: boolean;
  };
}

// ===============================================
// ENDPOINTS COMUNES (AMBOS BACKENDS)
// ===============================================

const COMMON_ENDPOINTS: EndpointConfig = {
  // Autenticación
  LOGIN: { path: '/api/auth/login', method: 'POST', auth: false },
  LOGOUT: { path: '/api/auth/logout', method: 'POST', auth: true },
  PROFILE: { path: '/api/auth/profile', method: 'GET', auth: true, cache: true },
  REFRESH_TOKEN: { path: '/api/auth/refresh', method: 'POST', auth: false },
  
  // Health Check
  HEALTH: { path: '/health', method: 'GET', auth: false, cache: true },
  TEST_DB: { path: '/test-db', method: 'GET', auth: false },
  
  // Parroquias
  PARROQUIAS_LIST: { path: '/api/parroquias', method: 'GET', auth: true, cache: true },
  PARROQUIAS_CREATE: { path: '/api/parroquias', method: 'POST', auth: true },
  PARROQUIAS_GET: { path: '/api/parroquias/:id', method: 'GET', auth: true, cache: true },
  PARROQUIAS_UPDATE: { path: '/api/parroquias/:id', method: 'PUT', auth: true },
  PARROQUIAS_DELETE: { path: '/api/parroquias/:id', method: 'DELETE', auth: true },
  PARROQUIAS_SEARCH: { path: '/api/parroquias/search', method: 'GET', auth: true },
  PARROQUIAS_STATS: { path: '/api/parroquias/:id/stats', method: 'GET', auth: true },
  
  // Niveles
  NIVELES_LIST: { path: '/api/niveles', method: 'GET', auth: true, cache: true },
  NIVELES_ORDERED: { path: '/api/niveles/ordenados', method: 'GET', auth: true, cache: true },
  NIVELES_CREATE: { path: '/api/niveles', method: 'POST', auth: true },
  NIVELES_GET: { path: '/api/niveles/:id', method: 'GET', auth: true, cache: true },
  NIVELES_UPDATE: { path: '/api/niveles/:id', method: 'PUT', auth: true },
  NIVELES_DELETE: { path: '/api/niveles/:id', method: 'DELETE', auth: true },
  NIVELES_REORDER: { path: '/api/niveles/reorder', method: 'PUT', auth: true },
  NIVELES_STATS: { path: '/api/niveles/:id/stats', method: 'GET', auth: true },
  
  // Catequizandos
  CATEQUIZANDOS_LIST: { path: '/api/catequizandos', method: 'GET', auth: true },
  CATEQUIZANDOS_CREATE: { path: '/api/catequizandos', method: 'POST', auth: true },
  CATEQUIZANDOS_GET: { path: '/api/catequizandos/:id', method: 'GET', auth: true, cache: true },
  CATEQUIZANDOS_UPDATE: { path: '/api/catequizandos/:id', method: 'PUT', auth: true },
  CATEQUIZANDOS_DELETE: { path: '/api/catequizandos/:id', method: 'DELETE', auth: true },
  CATEQUIZANDOS_SEARCH: { path: '/api/catequizandos/search', method: 'GET', auth: true },
  CATEQUIZANDOS_BY_DOCUMENT: { path: '/api/catequizandos/documento/:documento', method: 'GET', auth: true },
  CATEQUIZANDOS_STATS: { path: '/api/catequizandos/stats', method: 'GET', auth: true, cache: true },
  CATEQUIZANDOS_INSCRIPCIONES: { path: '/api/catequizandos/:id/inscripciones', method: 'GET', auth: true },
  CATEQUIZANDOS_CERTIFICADOS: { path: '/api/catequizandos/:id/certificados', method: 'GET', auth: true },
  CATEQUIZANDOS_VALIDATE: { path: '/api/catequizandos/:id/validar-inscripcion', method: 'POST', auth: true },
  
  // Grupos
  GRUPOS_LIST: { path: '/api/grupos', method: 'GET', auth: true },
  GRUPOS_CREATE: { path: '/api/grupos', method: 'POST', auth: true },
  GRUPOS_GET: { path: '/api/grupos/:id', method: 'GET', auth: true, cache: true },
  GRUPOS_UPDATE: { path: '/api/grupos/:id', method: 'PUT', auth: true },
  GRUPOS_DELETE: { path: '/api/grupos/:id', method: 'DELETE', auth: true },
  GRUPOS_BY_PARROQUIA: { path: '/api/grupos/parroquia/:idParroquia', method: 'GET', auth: true },
  GRUPOS_BY_NIVEL: { path: '/api/grupos/nivel/:idNivel', method: 'GET', auth: true },
  GRUPOS_SEARCH: { path: '/api/grupos/search', method: 'GET', auth: true },
  GRUPOS_INSCRIPCIONES: { path: '/api/grupos/:id/inscripciones', method: 'GET', auth: true },
  GRUPOS_CATEQUISTAS: { path: '/api/grupos/:id/catequistas', method: 'GET', auth: true },
  GRUPOS_STATS: { path: '/api/grupos/:id/stats', method: 'GET', auth: true },
  
  // Inscripciones
  INSCRIPCIONES_LIST: { path: '/api/inscripciones', method: 'GET', auth: true },
  INSCRIPCIONES_CREATE: { path: '/api/inscripciones', method: 'POST', auth: true },
  INSCRIPCIONES_INSCRIBIR: { path: '/api/inscripciones/inscribir', method: 'POST', auth: true },
  INSCRIPCIONES_GET: { path: '/api/inscripciones/:id', method: 'GET', auth: true },
  INSCRIPCIONES_UPDATE: { path: '/api/inscripciones/:id', method: 'PUT', auth: true },
  INSCRIPCIONES_DELETE: { path: '/api/inscripciones/:id', method: 'DELETE', auth: true },
  INSCRIPCIONES_BY_CATEQUIZANDO: { path: '/api/inscripciones/catequizando/:idCatequizando', method: 'GET', auth: true },
  INSCRIPCIONES_BY_GRUPO: { path: '/api/inscripciones/grupo/:idGrupo', method: 'GET', auth: true },
  INSCRIPCIONES_SEARCH: { path: '/api/inscripciones/search', method: 'GET', auth: true },
  INSCRIPCIONES_STATS: { path: '/api/inscripciones/stats', method: 'GET', auth: true },
  INSCRIPCIONES_PENDIENTES_PAGO: { path: '/api/inscripciones/pendientes-pago', method: 'GET', auth: true },
  INSCRIPCIONES_UPDATE_PAGO: { path: '/api/inscripciones/:id/pago', method: 'PUT', auth: true },
  
  // Asistencia
  ASISTENCIAS_LIST: { path: '/api/asistencias', method: 'GET', auth: true },
  ASISTENCIAS_CREATE: { path: '/api/asistencias', method: 'POST', auth: true },
  ASISTENCIAS_GET: { path: '/api/asistencias/:id', method: 'GET', auth: true },
  ASISTENCIAS_UPDATE: { path: '/api/asistencias/:id', method: 'PUT', auth: true },
  ASISTENCIAS_DELETE: { path: '/api/asistencias/:id', method: 'DELETE', auth: true },
  ASISTENCIAS_BY_INSCRIPCION: { path: '/api/asistencias/inscripcion/:idInscripcion', method: 'GET', auth: true },
  ASISTENCIAS_BY_GRUPO_FECHA: { path: '/api/asistencias/grupo/:idGrupo/fecha/:fecha', method: 'GET', auth: true },
  ASISTENCIAS_GRUPO_MASIVA: { path: '/api/asistencias/grupo/:idGrupo', method: 'POST', auth: true },
  ASISTENCIAS_REPORTE: { path: '/api/asistencias/reporte', method: 'GET', auth: true },
  ASISTENCIAS_STATS: { path: '/api/asistencias/stats', method: 'GET', auth: true },
  ASISTENCIAS_STATS_GRUPO: { path: '/api/asistencias/stats/grupo/:grupoId', method: 'GET', auth: true },
  ASISTENCIAS_BAJA: { path: '/api/asistencias/baja-asistencia', method: 'GET', auth: true },
  ASISTENCIAS_AUSENCIAS_PENDIENTES: { path: '/api/asistencias/ausencias-pendientes', method: 'GET', auth: true },
};

// ===============================================
// ENDPOINTS ESPECÍFICOS POR BACKEND
// ===============================================

/**
 * Endpoints específicos para SQL Server
 */
const SQLSERVER_ENDPOINTS: EndpointConfig = {
  ...COMMON_ENDPOINTS,
  
  // Certificados (SQL Server)
  CERTIFICADOS_LIST: { path: '/api/certificados', method: 'GET', auth: true },
  CERTIFICADOS_CREATE: { path: '/api/certificados', method: 'POST', auth: true },
  CERTIFICADOS_GET: { path: '/api/certificados/:id', method: 'GET', auth: true },
  CERTIFICADOS_EMITIR: { path: '/api/certificados/emitir', method: 'POST', auth: true },
  CERTIFICADOS_MASIVO: { path: '/api/certificados/masivo', method: 'POST', auth: true },
  CERTIFICADOS_DOWNLOAD: { path: '/api/certificados/:id/download', method: 'GET', auth: true },
  CERTIFICADOS_VALIDATE: { path: '/api/certificados/:codigo/validate', method: 'GET', auth: false },
  
  // Catequistas (específico SQL Server)
  CATEQUISTAS_LIST: { path: '/api/catequistas', method: 'GET', auth: true },
  CATEQUISTAS_CREATE: { path: '/api/catequistas', method: 'POST', auth: true },
  CATEQUISTAS_GET: { path: '/api/catequistas/:id', method: 'GET', auth: true },
  CATEQUISTAS_UPDATE: { path: '/api/catequistas/:id', method: 'PUT', auth: true },
  CATEQUISTAS_DELETE: { path: '/api/catequistas/:id', method: 'DELETE', auth: true },
};

/**
 * Endpoints específicos para MongoDB
 */
const MONGODB_ENDPOINTS: EndpointConfig = {
  ...COMMON_ENDPOINTS,
  
  // Usuarios (MongoDB específico)
  USUARIOS_LIST: { path: '/api/usuarios', method: 'GET', auth: true },
  USUARIOS_CREATE: { path: '/api/usuarios', method: 'POST', auth: true },
  USUARIOS_GET: { path: '/api/usuarios/:id', method: 'GET', auth: true },
  USUARIOS_UPDATE: { path: '/api/usuarios/:id', method: 'PUT', auth: true },
  USUARIOS_DELETE: { path: '/api/usuarios/:id', method: 'DELETE', auth: true },
  USUARIOS_SEARCH: { path: '/api/usuarios/search', method: 'GET', auth: true },
  USUARIOS_STATS: { path: '/api/usuarios/stats', method: 'GET', auth: true },
  USUARIOS_BY_ROLE: { path: '/api/usuarios/role/:role', method: 'GET', auth: true },
  USUARIOS_BY_PARROQUIA: { path: '/api/usuarios/parroquia/:parroquiaId', method: 'GET', auth: true },
  USUARIOS_CHANGE_PASSWORD: { path: '/api/usuarios/:id/change-password', method: 'PUT', auth: true },
  USUARIOS_RESET_PASSWORD: { path: '/api/usuarios/:id/reset-password', method: 'POST', auth: true },
  
  // Logs y actividad (MongoDB específico)
  ACTIVITY_LOGS: { path: '/api/logs/activity', method: 'GET', auth: true },
  SYSTEM_LOGS: { path: '/api/logs/system', method: 'GET', auth: true },
};

// ===============================================
// FUNCIONES UTILITARIAS
// ===============================================

/**
 * Obtiene los endpoints según el backend
 */
export function getEndpoints(backendType: BackendType): EndpointConfig {
  return backendType === 'sqlserver' ? SQLSERVER_ENDPOINTS : MONGODB_ENDPOINTS;
}

/**
 * Construye la URL completa de un endpoint
 */
export function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  let url = endpoint;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  
  return url;
}

/**
 * Reemplaza parámetros dinámicos en la URL
 */
export function replaceParams(path: string, params: Record<string, string | number>): string {
  let result = path;
  
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, encodeURIComponent(String(value)));
  });
  
  return result;
}

/**
 * Construye query string
 */
export function buildQueryString(params: Record<string, any>): string {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  return filtered ? `?${filtered}` : '';
}

/**
 * Combina path con query parameters
 */
export function buildFullUrl(
  path: string, 
  pathParams?: Record<string, string | number>,
  queryParams?: Record<string, any>
): string {
  let url = pathParams ? replaceParams(path, pathParams) : path;
  
  if (queryParams) {
    url += buildQueryString(queryParams);
  }
  
  return url;
}

/**
 * Valida si un endpoint requiere autenticación
 */
export function requiresAuth(endpointKey: string, backendType: BackendType): boolean {
  const endpoints = getEndpoints(backendType);
  return endpoints[endpointKey]?.auth ?? true;
}

/**
 * Valida si un endpoint puede usar cache
 */
export function canUseCache(endpointKey: string, backendType: BackendType): boolean {
  const endpoints = getEndpoints(backendType);
  return endpoints[endpointKey]?.cache ?? false;
}

/**
 * Obtiene el método HTTP de un endpoint
 */
export function getEndpointMethod(endpointKey: string, backendType: BackendType): string {
  const endpoints = getEndpoints(backendType);
  return endpoints[endpointKey]?.method ?? 'GET';
}

/**
 * Obtiene la configuración completa de un endpoint
 */
export function getEndpointConfig(endpointKey: string, backendType: BackendType) {
  const endpoints = getEndpoints(backendType);
  const config = endpoints[endpointKey];
  
  if (!config) {
    throw new Error(`Endpoint '${endpointKey}' not found for backend '${backendType}'`);
  }
  
  return config;
}

// ===============================================
// MAPEO DE RUTAS DINÁMICAS
// ===============================================

/**
 * Rutas que requieren parámetros dinámicos
 */
export const DYNAMIC_ROUTES = {
  // Con ID
  WITH_ID: [
    'PARROQUIAS_GET', 'PARROQUIAS_UPDATE', 'PARROQUIAS_DELETE', 'PARROQUIAS_STATS',
    'NIVELES_GET', 'NIVELES_UPDATE', 'NIVELES_DELETE', 'NIVELES_STATS',
    'CATEQUIZANDOS_GET', 'CATEQUIZANDOS_UPDATE', 'CATEQUIZANDOS_DELETE',
    'GRUPOS_GET', 'GRUPOS_UPDATE', 'GRUPOS_DELETE', 'GRUPOS_STATS',
    'INSCRIPCIONES_GET', 'INSCRIPCIONES_UPDATE', 'INSCRIPCIONES_DELETE',
    'ASISTENCIAS_GET', 'ASISTENCIAS_UPDATE', 'ASISTENCIAS_DELETE',
    'USUARIOS_GET', 'USUARIOS_UPDATE', 'USUARIOS_DELETE',
    'CERTIFICADOS_GET', 'CERTIFICADOS_DOWNLOAD',
  ],
  
  // Con múltiples parámetros
  MULTI_PARAM: [
    'CATEQUIZANDOS_BY_DOCUMENT', // :documento
    'GRUPOS_BY_PARROQUIA', // :idParroquia
    'GRUPOS_BY_NIVEL', // :idNivel
    'INSCRIPCIONES_BY_CATEQUIZANDO', // :idCatequizando
    'INSCRIPCIONES_BY_GRUPO', // :idGrupo
    'ASISTENCIAS_BY_INSCRIPCION', // :idInscripcion
    'ASISTENCIAS_BY_GRUPO_FECHA', // :idGrupo/:fecha
    'ASISTENCIAS_GRUPO_MASIVA', // :idGrupo
    'ASISTENCIAS_STATS_GRUPO', // :grupoId
    'USUARIOS_BY_PARROQUIA', // :parroquiaId
    'CERTIFICADOS_VALIDATE', // :codigo
  ],
} as const;

// ===============================================
// CONSTANTES DE URL
// ===============================================

export const API_PATHS = {
  AUTH: '/api/auth',
  PARROQUIAS: '/api/parroquias',
  NIVELES: '/api/niveles',
  CATEQUIZANDOS: '/api/catequizandos',
  GRUPOS: '/api/grupos',
  INSCRIPCIONES: '/api/inscripciones',
  ASISTENCIAS: '/api/asistencias',
  USUARIOS: '/api/usuarios',
  CERTIFICADOS: '/api/certificados',
  CATEQUISTAS: '/api/catequistas',
  LOGS: '/api/logs',
} as const;

// ===============================================
// EXPORTACIONES
// ===============================================

export {
  COMMON_ENDPOINTS,
  SQLSERVER_ENDPOINTS,
  MONGODB_ENDPOINTS,
};

export default {
  getEndpoints,
  buildUrl,
  buildFullUrl,
  replaceParams,
  buildQueryString,
  requiresAuth,
  canUseCache,
  getEndpointMethod,
  getEndpointConfig,
};