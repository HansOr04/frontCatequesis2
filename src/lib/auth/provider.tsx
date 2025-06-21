// ===============================================
// PROVIDER DE AUTENTICACIÓN
// ===============================================

'use client';

import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { AuthContext } from './context';
import type { 
  User, 
  LoginCredentials, 
  LoginResponse, 
  LoginError,
  AuthState,
  AuthAction,
  UserRole 
} from '../types/auth';
import { AUTH_CONFIG } from '../utils/constants';
import { apiClient } from '../api/client';

/**
 * Estado inicial de autenticación
 */
const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  lastActivity: Date.now(),
  loginAttempts: 0,
  error: null,
};

/**
 * Reducer para el estado de autenticación
 */
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginAttempts: 0,
        lastActivity: Date.now(),
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        loginAttempts: state.loginAttempts + 1,
      };

    case 'LOGOUT':
      return {
        ...initialAuthState,
        isLoading: false,
        loginAttempts: state.loginAttempts,
      };

    case 'REFRESH_TOKEN':
      return {
        ...state,
        token: action.payload,
        lastActivity: Date.now(),
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: Date.now(),
      };

    case 'INCREMENT_ATTEMPTS':
      return {
        ...state,
        loginAttempts: state.loginAttempts + 1,
      };

    case 'RESET_ATTEMPTS':
      return {
        ...state,
        loginAttempts: 0,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

/**
 * Props del AuthProvider
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider de autenticación
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  // ===============================================
  // UTILIDADES DE ALMACENAMIENTO
  // ===============================================

  const setStorageItem = useCallback((key: string, value: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Error saving to localStorage:`, error);
    }
  }, []);

  const getStorageItem = useCallback((key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn(`Error reading from localStorage:`, error);
    }
    return null;
  }, []);

  const removeStorageItem = useCallback((key: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing from localStorage:`, error);
    }
  }, []);

  const clearAuthStorage = useCallback(() => {
    removeStorageItem(AUTH_CONFIG.tokenKey);
    removeStorageItem(AUTH_CONFIG.refreshTokenKey);
    removeStorageItem(AUTH_CONFIG.userKey);
  }, [removeStorageItem]);

  // ===============================================
  // VERIFICACIÓN DE TOKENS
  // ===============================================

  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      // Token expira en menos de 5 minutos
      return expirationTime - currentTime < AUTH_CONFIG.refreshThreshold;
    } catch (error) {
      console.warn('Error parsing token:', error);
      return true;
    }
  }, []);

  // ===============================================
  // FUNCIONES DE AUTENTICACIÓN
  // ===============================================

  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResponse | LoginError> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Determinar qué backend usar
      const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE as 'sqlserver' | 'mongodb';
      const adapter = backendType === 'sqlserver' 
        ? await import('../api/adapters/sqlserver').then(m => m.sqlServerAdapter)
        : await import('../api/adapters/mongodb').then(m => m.mongoAdapter);

      const response = await adapter.auth.login(credentials);
      
      if (response.success) {
        const { user, token, refreshToken } = response.data;
        
        // Guardar en localStorage
        setStorageItem(AUTH_CONFIG.tokenKey, token);
        setStorageItem(AUTH_CONFIG.userKey, JSON.stringify(user));
        if (refreshToken) {
          setStorageItem(AUTH_CONFIG.refreshTokenKey, refreshToken);
        }

        // Actualizar estado
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token, refreshToken },
        });

        // Configurar timer de renovación
        setupRefreshTimer(token);

        return response;
      } else {
        // Esto no debería pasar con la nueva estructura
        const error: LoginError = {
          success: false,
          message: 'Error de login',
        };
        dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
        return error;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 'Error de conexión';
      const loginError: LoginError = {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors,
        intentosRestantes: error.response?.data?.intentosRestantes,
        bloqueadoHasta: error.response?.data?.bloqueadoHasta,
      };
      
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return loginError;
    }
  }, [setStorageItem]);

  const logout = useCallback(async () => {
    try {
      // Intentar notificar al servidor
      const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE as 'sqlserver' | 'mongodb';
      const adapter = backendType === 'sqlserver' 
        ? await import('../api/adapters/sqlserver').then(m => m.sqlServerAdapter)
        : await import('../api/adapters/mongodb').then(m => m.mongoAdapter);

      await adapter.auth.logout();
    } catch (error) {
      console.warn('Error during logout API call:', error);
    } finally {
      // Limpiar storage y estado independientemente del resultado de la API
      clearAuthStorage();
      dispatch({ type: 'LOGOUT' });
      
      // Limpiar timer de renovación
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }
      
      // Redirigir al login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  }, [clearAuthStorage, refreshTimer]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const storedRefreshToken = getStorageItem(AUTH_CONFIG.refreshTokenKey);
    
    if (!storedRefreshToken) {
      console.warn('No refresh token available');
      logout();
      return false;
    }

    try {
      const backendType = process.env.NEXT_PUBLIC_BACKEND_TYPE as 'sqlserver' | 'mongodb';
      const adapter = backendType === 'sqlserver' 
        ? await import('../api/adapters/sqlserver').then(m => m.sqlServerAdapter)
        : await import('../api/adapters/mongodb').then(m => m.mongoAdapter);

      const response = await adapter.auth.refreshToken(storedRefreshToken);
      
      if (response.success && response.data.token) {
        const newToken = response.data.token;
        
        // Actualizar localStorage
        setStorageItem(AUTH_CONFIG.tokenKey, newToken);
        
        // Actualizar estado
        dispatch({ type: 'REFRESH_TOKEN', payload: newToken });
        
        // Reconfigurar timer
        setupRefreshTimer(newToken);
        
        return true;
      } else {
        console.warn('Token refresh failed');
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  }, [getStorageItem, setStorageItem, logout]);

  const setupRefreshTimer = useCallback((token: string) => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilRefresh = expirationTime - currentTime - AUTH_CONFIG.refreshThreshold;

      if (timeUntilRefresh > 0) {
        const timer = setTimeout(() => {
          refreshToken();
        }, timeUntilRefresh);
        
        setRefreshTimer(timer);
      } else {
        // Token ya está por expirar, renovar inmediatamente
        refreshToken();
      }
    } catch (error) {
      console.warn('Error setting up refresh timer:', error);
    }
  }, [refreshTimer, refreshToken]);

  // ===============================================
  // VERIFICACIÓN DE PERMISOS
  // ===============================================

  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user) return false;
    
    // Admin tiene todos los permisos
    if (state.user.tipo === 'admin') return true;
    
    // Verificar si el usuario tiene el permiso específico
    return state.user.permisos.includes(permission);
  }, [state.user]);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!state.user) return false;
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(state.user.tipo);
  }, [state.user]);

  // ===============================================
  // OTRAS FUNCIONES
  // ===============================================

  const updateUser = useCallback((userData: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...userData };
    setStorageItem(AUTH_CONFIG.userKey, JSON.stringify(updatedUser));
    
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, [state.user, setStorageItem]);

  // ===============================================
  // EFECTOS
  // ===============================================

  // Inicialización: verificar si hay una sesión almacenada
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getStorageItem(AUTH_CONFIG.tokenKey);
        const storedUser = getStorageItem(AUTH_CONFIG.userKey);

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);
          
          // Verificar si el token no ha expirado
          if (!isTokenExpired(storedToken)) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user,
                token: storedToken,
                refreshToken: getStorageItem(AUTH_CONFIG.refreshTokenKey),
              },
            });
            
            setupRefreshTimer(storedToken);
          } else {
            // Token expirado, intentar renovar
            const refreshSuccess = await refreshToken();
            if (!refreshSuccess) {
              clearAuthStorage();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthStorage();
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, [getStorageItem, isTokenExpired, refreshToken, clearAuthStorage, setupRefreshTimer]);

  // Actividad del usuario: actualizar última actividad
  useEffect(() => {
    const updateActivity = () => {
      if (state.isAuthenticated) {
        dispatch({ type: 'UPDATE_ACTIVITY' });
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [state.isAuthenticated]);

  // Verificar sesión expirada por inactividad
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const checkSessionTimeout = setInterval(() => {
      const timeSinceLastActivity = Date.now() - state.lastActivity;
      
      if (timeSinceLastActivity > AUTH_CONFIG.sessionTimeout) {
        console.warn('Session expired due to inactivity');
        logout();
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(checkSessionTimeout);
  }, [state.isAuthenticated, state.lastActivity, logout]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [refreshTimer]);

  // ===============================================
  // CONTEXT VALUE
  // ===============================================

  const contextValue = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;