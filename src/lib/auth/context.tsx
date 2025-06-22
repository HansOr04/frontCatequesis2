// ===============================================
// CONTEXT DE AUTENTICACIÓN
// ===============================================

'use client';

import { createContext, useContext } from 'react';
import type { AuthContextType, UserRole } from '../types/auth';

/**
 * Context de autenticación
 */
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook para usar el context de autenticación
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuthContext debe ser usado dentro de un AuthProvider'
    );
  }
  
  return context;
}

/**
 * Hook para verificar si está autenticado
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated;
}

/**
 * Hook para obtener el usuario actual
 */
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuthContext();
  return isAuthenticated ? user : null;
}

/**
 * Hook para obtener información del usuario
 */
export function useUserInfo() {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    userId: user?.id,
    username: user?.username,
    email: user?.email,
    role: user?.tipo,
    permissions: user?.permisos || [],
    parroquia: user?.parroquia,
    nombreCompleto: user?.datosPersonales 
      ? `${user.datosPersonales.nombres} ${user.datosPersonales.apellidos}`
      : user?.username,
  };
}

/**
 * Hook para verificar permisos
 */
export function usePermissions() {
  const { hasPermission, hasRole } = useAuthContext();
  
  return {
    hasPermission,
    hasRole,
    checkPermission: hasPermission,
    checkRole: hasRole,
  };
}

/**
 * Hook para acciones de autenticación
 */
export function useAuthActions() {
  const { login, logout, refreshToken, updateUser } = useAuthContext();
  
  return {
    login,
    logout,
    refreshToken,
    updateUser,
  };
}

/**
 * Hook combinado de autenticación (más conveniente)
 */
export function useAuth() {
  const context = useAuthContext();
  const userInfo = useUserInfo();
  const permissions = usePermissions();
  const actions = useAuthActions();
  
  return {
    // Estado base
    ...context,
    
    // Información del usuario
    ...userInfo,
    
    // Permisos
    ...permissions,
    
    // Acciones
    ...actions,
    
    // Utilidades adicionales
    isAdmin: userInfo.role === 'admin',
    isParroco: userInfo.role === 'parroco',
    isSecretaria: userInfo.role === 'secretaria',
    isCatequista: userInfo.role === 'catequista',
    isConsulta: userInfo.role === 'consulta',
    
    // Estado de carga
    isAuthLoading: context.isLoading,
    
    // Verificaciones rápidas
    canCreate: permissions.hasPermission('create') || userInfo.role === 'admin',
    canEdit: permissions.hasPermission('update') || userInfo.role === 'admin',
    canDelete: permissions.hasPermission('delete') || userInfo.role === 'admin',
    canViewAll: permissions.hasRole(['admin', 'parroco'] as UserRole[]),
    canManage: permissions.hasRole(['admin', 'parroco', 'secretaria'] as UserRole[]),
  };
}

/**
 * HOC para proteger componentes que requieren autenticación
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      // Redirigir al login será manejado por el middleware de Next.js
      return null;
    }
    
    return <Component {...props} />;
  };
}

/**
 * HOC para proteger componentes que requieren roles específicos
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: UserRole | UserRole[]
): React.ComponentType<P> {
  return function RoleProtectedComponent(props: P) {
    const { hasRole, isLoading, isAuthenticated } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return null;
    }
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!hasRole(roles)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600">
              No tienes permisos suficientes para acceder a esta página.
            </p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

/**
 * HOC para proteger componentes que requieren permisos específicos
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: string | string[]
): React.ComponentType<P> {
  return function PermissionProtectedComponent(props: P) {
    const { hasPermission, isLoading, isAuthenticated } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return null;
    }
    
    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];
      
    const hasAllPermissions = permissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasAllPermissions) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Permisos Insuficientes
            </h2>
            <p className="text-gray-600">
              No tienes los permisos necesarios para realizar esta acción.
            </p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

export default AuthContext;