// ===============================================
// HOOK DE AUTENTICACIÓN
// ===============================================

'use client';

import { useCallback, useEffect, useState } from 'react';
import { 
  useAuth as useAuthContext,
  useUserInfo,
  usePermissions,
  useAuthActions
} from '../auth/context';
import type { LoginCredentials, User, UserRole } from '../types/auth';
import { AUTH_CONFIG } from '../utils/constants';

/**
 * Hook principal de autenticación
 * Re-exporta desde el context con funcionalidades adicionales
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Hook para gestión de estado de login
 */
export function useLogin() {
  const { login: contextLogin, isLoading } = useAuth();
  const [loginState, setLoginState] = useState({
    isLoggingIn: false,
    error: null as string | null,
    success: false,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoginState({ isLoggingIn: true, error: null, success: false });
    
    try {
      const result = await contextLogin(credentials);
      
      if (result.success) {
        setLoginState({ isLoggingIn: false, error: null, success: true });
        return { success: true, data: result.data };
      } else {
        const error = result as any; // LoginError
        setLoginState({ 
          isLoggingIn: false, 
          error: error.message || 'Error de login', 
          success: false 
        });
        return { success: false, error: error.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error de conexión';
      setLoginState({ isLoggingIn: false, error: errorMessage, success: false });
      return { success: false, error: errorMessage };
    }
  }, [contextLogin]);

  const resetLoginState = useCallback(() => {
    setLoginState({ isLoggingIn: false, error: null, success: false });
  }, []);

  return {
    login,
    isLoggingIn: loginState.isLoggingIn || isLoading,
    error: loginState.error,
    success: loginState.success,
    resetLoginState,
  };
}

/**
 * Hook para verificar permisos específicos
 */
export function usePermissionsCheck(requiredPermissions?: string | string[]) {
  const { hasPermission, hasRole, permissions, role } = useAuth();
  
  const checkPermissions = useCallback((perms: string | string[]) => {
    if (!perms) return true;
    
    const permArray = Array.isArray(perms) ? perms : [perms];
    return permArray.every(perm => hasPermission(perm));
  }, [hasPermission]);

  const checkRoles = useCallback((roles: UserRole | UserRole[]) => {
    return hasRole(roles);
  }, [hasRole]);

  // Verificar permisos automáticamente si se proporcionan
  const hasRequiredPermissions = requiredPermissions 
    ? checkPermissions(requiredPermissions)
    : true;

  return {
    hasPermission,
    hasRole,
    checkPermissions,
    checkRoles,
    hasRequiredPermissions,
    permissions,
    role,
    isAdmin: role === 'admin',
    isParroco: role === 'parroco',
    isSecretaria: role === 'secretaria',
    isCatequista: role === 'catequista',
    isConsulta: role === 'consulta',
  };
}

/**
 * Hook para gestión de perfil de usuario
 */
export function useUserProfile() {
  const { user, updateUser, isAuthenticated } = useAuth();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    if (!isAuthenticated || !user) {
      setUpdateError('Usuario no autenticado');
      return { success: false, error: 'Usuario no autenticado' };
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      // Aquí podrías hacer una llamada al API para actualizar en el servidor
      // Por ahora solo actualiza localmente
      updateUser(profileData);
      
      setIsUpdating(false);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      setUpdateError(errorMessage);
      setIsUpdating(false);
      return { success: false, error: errorMessage };
    }
  }, [isAuthenticated, user, updateUser]);

  return {
    user,
    updateProfile,
    isUpdating,
    updateError,
    clearError: () => setUpdateError(null),
  };
}

/**
 * Hook para verificar si el token está próximo a expirar
 */
export function useTokenExpiration() {
  const { isAuthenticated } = useAuth();
  const [timeUntilExpiration, setTimeUntilExpiration] = useState<number | null>(null);
  const [isNearExpiration, setIsNearExpiration] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeUntilExpiration(null);
      setIsNearExpiration(false);
      return;
    }

    const checkExpiration = () => {
      try {
        const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;

        setTimeUntilExpiration(timeLeft);
        setIsNearExpiration(timeLeft < AUTH_CONFIG.refreshThreshold);
      } catch (error) {
        console.warn('Error checking token expiration:', error);
      }
    };

    // Verificar inmediatamente
    checkExpiration();

    // Verificar cada minuto
    const interval = setInterval(checkExpiration, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return {
    timeUntilExpiration,
    isNearExpiration,
    minutesUntilExpiration: timeUntilExpiration ? Math.floor(timeUntilExpiration / (1000 * 60)) : null,
  };
}

/**
 * Hook para proteger componentes con roles específicos
 */
export function useRoleGuard(allowedRoles: UserRole | UserRole[]) {
  const { hasRole, isAuthenticated, isLoading, role } = useAuth();
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasAccess = isAuthenticated && hasRole(roles);
  
  return {
    hasAccess,
    isLoading,
    isAuthenticated,
    currentRole: role,
    allowedRoles: roles,
    canAccess: hasAccess,
  };
}

/**
 * Hook para proteger componentes con permisos específicos
 */
export function usePermissionGuard(requiredPermissions: string | string[]) {
  const { hasPermission, isAuthenticated, isLoading, permissions } = useAuth();
  
  const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  const hasAccess = isAuthenticated && perms.every(perm => hasPermission(perm));
  
  return {
    hasAccess,
    isLoading,
    isAuthenticated,
    userPermissions: permissions,
    requiredPermissions: perms,
    canAccess: hasAccess,
  };
}

/**
 * Hook para logout con confirmación
 */
export function useLogout() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const logoutWithConfirmation = useCallback(async (skipConfirmation = false) => {
    if (!skipConfirmation) {
      const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
      if (!confirmed) return { success: false, cancelled: true };
    }

    setIsLoggingOut(true);
    
    try {
      await logout();
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  const forceLogout = useCallback(() => {
    return logoutWithConfirmation(true);
  }, [logoutWithConfirmation]);

  return {
    logout: logoutWithConfirmation,
    forceLogout,
    isLoggingOut,
  };
}

/**
 * Hook para verificar actividad del usuario
 */
export function useUserActivity() {
  const { isAuthenticated } = useAuth();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      setLastActivity(Date.now());
      setIsActive(true);
    };

    const checkInactivity = () => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      const isCurrentlyActive = timeSinceLastActivity < 5 * 60 * 1000; // 5 minutos
      setIsActive(isCurrentlyActive);
    };

    // Eventos que indican actividad
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Verificar inactividad cada minuto
    const inactivityInterval = setInterval(checkInactivity, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(inactivityInterval);
    };
  }, [isAuthenticated, lastActivity]);

  return {
    lastActivity,
    isActive,
    minutesSinceLastActivity: Math.floor((Date.now() - lastActivity) / (1000 * 60)),
  };
}

/**
 * Hook para información de sesión
 */
export function useSessionInfo() {
  const { isAuthenticated, user } = useAuth();
  const { timeUntilExpiration, isNearExpiration } = useTokenExpiration();
  const { isActive, minutesSinceLastActivity } = useUserActivity();

  return {
    isAuthenticated,
    user,
    sessionActive: isActive,
    minutesSinceLastActivity,
    timeUntilExpiration,
    isNearExpiration,
    sessionValid: isAuthenticated && !isNearExpiration,
  };
}

// Re-exportar los hooks del context para conveniencia
export {
  useAuthContext,
  useUserInfo,
  usePermissions,
  useAuthActions,
} from '../auth/context';

export default useAuth;