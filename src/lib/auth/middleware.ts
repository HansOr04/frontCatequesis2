// ===============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ===============================================

import { NextRequest, NextResponse } from 'next/server';

// Tipos locales para evitar dependencias circulares
type UserRole = 'admin' | 'parroco' | 'secretaria' | 'catequista' | 'consulta';

// Constantes locales
const AUTH_CONFIG = {
  tokenKey: 'catequesis_token',
  refreshTokenKey: 'catequesis_refresh_token',
  userKey: 'catequesis_user',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
  refreshThreshold: 5 * 60 * 1000, // 5 minutos antes de expirar
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos
};

/**
 * Configuración de rutas protegidas
 */
interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Configuración de rutas del sistema
 */
const ROUTE_CONFIGS: RouteConfig[] = [
  // Rutas públicas
  { path: '/', requiresAuth: false },
  { path: '/auth/login', requiresAuth: false },
  { path: '/auth/logout', requiresAuth: false },
  
  // Dashboard (requiere autenticación)
  { 
    path: '/dashboard', 
    requiresAuth: true,
    redirectTo: '/auth/login'
  },
  
  // Catequizandos
  { 
    path: '/catequizandos', 
    requiresAuth: true,
    allowedRoles: ['admin', 'parroco', 'secretaria', 'catequista']
  },
  
  // Catequistas
  { 
    path: '/catequistas', 
    requiresAuth: true,
    allowedRoles: ['admin', 'parroco', 'secretaria']
  },
  
  // Grupos
  { 
    path: '/grupos', 
    requiresAuth: true,
    allowedRoles: ['admin', 'parroco', 'secretaria', 'catequista']
  },
  
  // Asistencia
  { 
    path: '/asistencia', 
    requiresAuth: true,
    allowedRoles: ['admin', 'parroco', 'secretaria', 'catequista']
  },
  
  // Certificados
  { 
    path: '/certificados', 
    requiresAuth: true,
    allowedRoles: ['admin', 'parroco', 'secretaria']
  },
  
  // Administración (solo admin y párroco)
  { 
    path: '/administracion', 
    requiresAuth: true,
    allowedRoles: ['admin', 'parroco']
  },
  
  // Configuración de cuenta
  { 
    path: '/cuenta', 
    requiresAuth: true
  },
];

/**
 * Verifica si una ruta coincide con un patrón
 */
function matchRoute(pathname: string, routePath: string): boolean {
  // Rutas exactas
  if (routePath === pathname) return true;
  
  // Rutas que empiezan con el patrón (para subrutas)
  return pathname.startsWith(routePath + '/');
}

/**
 * Encuentra la configuración de ruta más específica
 */
function findRouteConfig(pathname: string): RouteConfig | null {
  // Buscar coincidencia exacta primero
  let exactMatch = ROUTE_CONFIGS.find(config => config.path === pathname);
  if (exactMatch) return exactMatch;
  
  // Buscar coincidencia por prefijo (más específica primero)
  const sortedConfigs = ROUTE_CONFIGS
    .filter(config => pathname.startsWith(config.path + '/'))
    .sort((a, b) => b.path.length - a.path.length);
  
  return sortedConfigs[0] || null;
}

/**
 * Decodifica y valida el JWT token
 */
function decodeJWT(token: string): { role: UserRole; exp: number; id: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Verificar que el token no haya expirado
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }
    
    return {
      role: payload.tipo || payload.role,
      exp: payload.exp,
      id: payload.id,
    };
  } catch (error) {
    console.warn('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Obtiene el token del request
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Primero intentar desde el header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Luego intentar desde las cookies
  const tokenFromCookie = request.cookies.get(AUTH_CONFIG.tokenKey)?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }
  
  return null;
}

/**
 * Verifica si el usuario tiene permisos para acceder a la ruta
 */
function hasRouteAccess(userRole: UserRole, routeConfig: RouteConfig): boolean {
  // Si no hay roles específicos requeridos, cualquier usuario autenticado puede acceder
  if (!routeConfig.allowedRoles || routeConfig.allowedRoles.length === 0) {
    return true;
  }
  
  // Admin siempre tiene acceso
  if (userRole === 'admin') {
    return true;
  }
  
  // Verificar si el rol del usuario está en la lista de roles permitidos
  return routeConfig.allowedRoles.includes(userRole);
}

/**
 * Crea response de redirección con el destino original
 */
function createRedirectResponse(
  request: NextRequest, 
  redirectTo: string = '/auth/login'
): NextResponse {
  const redirectUrl = new URL(redirectTo, request.url);
  
  // Agregar la URL original como parámetro para redirigir después del login
  if (redirectTo.includes('/auth/login')) {
    redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
  }
  
  const response = NextResponse.redirect(redirectUrl);
  
  // Headers de seguridad adicionales
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

/**
 * Crea response de acceso denegado
 */
function createAccessDeniedResponse(request: NextRequest): NextResponse {
  const accessDeniedUrl = new URL('/auth/access-denied', request.url);
  return NextResponse.redirect(accessDeniedUrl);
}

/**
 * Middleware principal de autenticación
 */
export function authMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  
  // Ignorar archivos estáticos y API routes que no requieren auth
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return null; // Continuar sin modificar
  }
  
  // Buscar configuración de la ruta
  const routeConfig = findRouteConfig(pathname);
  
  // Si no hay configuración específica, permitir acceso
  if (!routeConfig) {
    return null;
  }
  
  // Si la ruta no requiere autenticación, permitir acceso
  if (!routeConfig.requiresAuth) {
    return null;
  }
  
  // Obtener token del request
  const token = getTokenFromRequest(request);
  
  // Si no hay token, redirigir al login
  if (!token) {
    console.warn(`Access denied to ${pathname}: No token provided`);
    return createRedirectResponse(request, routeConfig.redirectTo);
  }
  
  // Decodificar y validar token
  const decodedToken = decodeJWT(token);
  
  // Si el token es inválido o expirado, redirigir al login
  if (!decodedToken) {
    console.warn(`Access denied to ${pathname}: Invalid or expired token`);
    return createRedirectResponse(request, routeConfig.redirectTo);
  }
  
  // Verificar permisos de rol
  if (!hasRouteAccess(decodedToken.role, routeConfig)) {
    console.warn(
      `Access denied to ${pathname}: User role '${decodedToken.role}' not allowed. Required: ${routeConfig.allowedRoles?.join(', ')}`
    );
    return createAccessDeniedResponse(request);
  }
  
  // Si llegamos aquí, el usuario tiene acceso
  // Agregar headers con información del usuario para las páginas
  const response = NextResponse.next();
  
  response.headers.set('X-User-ID', decodedToken.id);
  response.headers.set('X-User-Role', decodedToken.role);
  response.headers.set('X-Token-Exp', decodedToken.exp.toString());
  
  return response;
}

/**
 * Verifica si el usuario está autenticado (para uso en componentes)
 */
export function isAuthenticated(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  
  const decodedToken = decodeJWT(token);
  return decodedToken !== null;
}

/**
 * Obtiene el rol del usuario del request (para uso en API routes)
 */
export function getUserRole(request: NextRequest): UserRole | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decodedToken = decodeJWT(token);
  return decodedToken?.role || null;
}

/**
 * Obtiene el ID del usuario del request (para uso en API routes)
 */
export function getUserId(request: NextRequest): string | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decodedToken = decodeJWT(token);
  return decodedToken?.id || null;
}

/**
 * Middleware para rutas de API que requieren autenticación
 */
export function requireAuth(
  handler: (request: NextRequest, context: { userId: string; userRole: UserRole }) => Promise<NextResponse>,
  allowedRoles?: UserRole[]
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }
    
    const decodedToken = decodeJWT(token);
    
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: 'Token inválido o expirado' },
        { status: 401 }
      );
    }
    
    if (allowedRoles && !allowedRoles.includes(decodedToken.role) && decodedToken.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Permisos insuficientes' },
        { status: 403 }
      );
    }
    
    return handler(request, {
      userId: decodedToken.id,
      userRole: decodedToken.role,
    });
  };
}

export default authMiddleware;