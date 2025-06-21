// ===============================================
// TIPOS DE AUTENTICACIÓN
// ===============================================

/**
 * Roles disponibles en el sistema
 */
export type UserRole = 'admin' | 'parroco' | 'secretaria' | 'catequista' | 'consulta';

/**
 * Estados de usuario
 */
export type UserStatus = 'activo' | 'inactivo' | 'bloqueado' | 'pendiente';

/**
 * Datos del usuario autenticado
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  tipo: UserRole;
  estado: UserStatus;
  datosPersonales: {
    nombres: string;
    apellidos: string;
    documento?: string;
    telefono?: string;
    direccion?: string;
  };
  parroquia?: {
    id: string;
    nombre: string;
  };
  permisos: string[];
  ultimoAcceso?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Datos de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
  recordarme?: boolean;
}

/**
 * Respuesta de login exitoso
 */
export interface LoginResponse {
  success: true;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
    expiresIn: number;
  };
}

/**
 * Respuesta de login fallido
 */
export interface LoginError {
  success: false;
  message: string;
  errors?: {
    username?: string;
    password?: string;
    general?: string;
  };
  intentosRestantes?: number;
  bloqueadoHasta?: string;
}

/**
 * Token JWT decodificado
 */
export interface JWTPayload {
  id: string;
  username: string;
  tipo: UserRole;
  parroquiaId?: string;
  permisos: string[];
  iat: number;
  exp: number;
}

/**
 * Contexto de autenticación
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResponse | LoginError>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

/**
 * Permisos del sistema
 */
export interface Permission {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'usuarios' | 'catequizandos' | 'grupos' | 'asistencia' | 'certificados' | 'administracion';
  accion: 'crear' | 'leer' | 'actualizar' | 'eliminar' | 'administrar';
}

/**
 * Configuración de sesión
 */
export interface SessionConfig {
  tokenName: string;
  refreshTokenName: string;
  expirationTime: number;
  refreshThreshold: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

/**
 * Datos para cambio de contraseña
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Datos para recuperación de contraseña
 */
export interface ForgotPasswordData {
  email?: string;
  username?: string;
}

/**
 * Estado de autenticación
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: number;
  loginAttempts: number;
  error: string | null;
}

/**
 * Acciones de autenticación
 */
export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken?: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: string }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_ACTIVITY' }
  | { type: 'INCREMENT_ATTEMPTS' }
  | { type: 'RESET_ATTEMPTS' }
  | { type: 'SET_ERROR'; payload: string | null };

/**
 * Información de sesión activa
 */
export interface SessionInfo {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  location?: {
    country: string;
    city: string;
  };
}

/**
 * Log de actividad de usuario
 */
export interface UserActivity {
  id: string;
  userId: string;
  accion: string;
  modulo: string;
  detalles?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

/**
 * Configuración de 2FA (para futuro)
 */
export interface TwoFactorAuth {
  enabled: boolean;
  method: 'sms' | 'email' | 'app';
  backupCodes: string[];
  lastUsed?: string;
}