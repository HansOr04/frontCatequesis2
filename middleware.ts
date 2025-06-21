// ===============================================
// MIDDLEWARE PRINCIPAL DE NEXT.JS
// ===============================================

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './src/lib/auth/middleware';

/**
 * Configuración del matcher para el middleware
 */
export const config = {
  /*
   * Coincide con todas las rutas excepto:
   * - api (API routes)
   * - _next/static (archivos estáticos)
   * - _next/image (optimización de imágenes)
   * - favicon.ico (favicon)
   * - archivos públicos con extensión
   */
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

/**
 * Middleware principal
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Log de requests en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 Middleware: ${request.method} ${pathname}`);
  }
  
  // ===============================================
  // MANEJO DE REDIRECCIONES
  // ===============================================
  
  // Redirigir root a dashboard si está autenticado, sino a login
  if (pathname === '/') {
    // Verificar si hay token para decidir redirección
    const token = request.cookies.get('catequesis_token')?.value;
    
    if (token) {
      // Si hay token, verificar que sea válido antes de redirigir
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (!isExpired) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        // Token inválido, continuar al login
      }
    }
    
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // ===============================================
  // MIDDLEWARE DE AUTENTICACIÓN
  // ===============================================
  
  const authResponse = authMiddleware(request);
  if (authResponse) {
    return authResponse;
  }
  
  // ===============================================
  // HEADERS DE SEGURIDAD
  // ===============================================
  
  const response = NextResponse.next();
  
  // Headers de seguridad generales
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP (Content Security Policy) básico
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' " +
      (process.env.NEXT_PUBLIC_SQLSERVER_URL || 'http://localhost:3000') + " " +
      (process.env.NEXT_PUBLIC_MONGODB_URL || 'http://localhost:3001')
    );
  }
  
  // ===============================================
  // HEADERS PERSONALIZADOS
  // ===============================================
  
  // Información de la aplicación
  response.headers.set('X-App-Name', 'Sistema de Catequesis');
  response.headers.set('X-App-Version', '1.0.0');
  
  // Información del backend activo
  const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE || 'sqlserver';
  response.headers.set('X-Backend-Type', backendType);
  
  // Timestamp del request
  response.headers.set('X-Timestamp', new Date().toISOString());
  
  // ===============================================
  // MANEJO DE ERRORES Y LOGGING
  // ===============================================
  
  // Log de accesos exitosos en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Access granted to: ${pathname}`);
  }
  
  return response;
}

/**
 * Función auxiliar para verificar si una ruta es pública
 */
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/logout',
    '/auth/access-denied',
  ];
  
  return publicRoutes.includes(pathname);
}

/**
 * Función auxiliar para verificar si una ruta es de API pública
 */
function isPublicApiRoute(pathname: string): boolean {
  const publicApiRoutes = [
    '/api/health',
    '/api/auth/login',
    '/api/auth/refresh',
  ];
  
  return publicApiRoutes.some(route => pathname.startsWith(route));
}

/**
 * Función auxiliar para obtener información del dispositivo
 */
function getDeviceInfo(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isTablet = /iPad|Tablet/.test(userAgent);
  
  return {
    userAgent,
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}

/**
 * Función auxiliar para logging avanzado
 */
function logRequest(request: NextRequest, response?: NextResponse) {
  if (process.env.NODE_ENV !== 'development') return;
  
  const { pathname, search } = request.nextUrl;
  const method = request.method;
  const userAgent = request.headers.get('user-agent');
  const referer = request.headers.get('referer');
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  console.log(`📊 Request Log:`, {
    timestamp: new Date().toISOString(),
    method,
    pathname,
    search,
    ip,
    userAgent: userAgent?.substring(0, 100),
    referer,
    status: response?.status || 'pending',
  });
}