// ===============================================
// CLIENTE HTTP PARA API
// ===============================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Extender AxiosRequestConfig para incluir _retry
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
import type { ApiResponse, ApiError, BackendType, RequestConfig } from '../types/api';
import { AUTH_CONFIG } from '../utils/constants';

/**
 * Configuración del cliente HTTP
 */
interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

/**
 * Clase principal del cliente HTTP
 */
class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: HttpClientConfig;
  private retryCount: Map<string, number> = new Map();

  constructor(config: HttpClientConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configura los interceptores de request y response
   */
  private setupInterceptors(): void {
    // Interceptor de Request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Agregar token de autenticación
        const token = this.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log de request en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de Response
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log de response exitosa en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        // Limpiar contador de reintentos en caso exitoso
        const requestKey = this.getRequestKey(response.config);
        this.retryCount.delete(requestKey);

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Log de error
        console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });

        // Manejar errores de autenticación
        if (error.response?.status === 401 && !originalRequest._retry) {
          return this.handleUnauthorized(originalRequest);
        }

        // Manejar reintentos para errores de red
        if (this.shouldRetry(error, originalRequest)) {
          return this.retryRequest(originalRequest);
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Obtiene el token de autenticación
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(AUTH_CONFIG.tokenKey);
    } catch (error) {
      console.warn('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Maneja errores de autenticación (401)
   */
  private async handleUnauthorized(originalRequest: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      // Intentar renovar el token
      const refreshToken = localStorage.getItem(AUTH_CONFIG.refreshTokenKey);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Llamar al endpoint de refresh
      const response = await axios.post(`${this.config.baseURL}/api/auth/refresh`, {
        refreshToken,
      });

      const { token } = response.data.data;
      
      // Guardar nuevo token
      localStorage.setItem(AUTH_CONFIG.tokenKey, token);

      // Reintentar request original con nuevo token
      originalRequest._retry = true;
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      }

      return this.axiosInstance(originalRequest);
    } catch (refreshError) {
      // Si falla el refresh, limpiar tokens y redirigir al login
      this.clearAuth();
      window.location.href = '/auth/login';
      throw refreshError;
    }
  }

  /**
   * Determina si un request debe reintentarse
   */
  private shouldRetry(error: AxiosError, config: AxiosRequestConfig): boolean {
    const requestKey = this.getRequestKey(config);
    const currentRetries = this.retryCount.get(requestKey) || 0;

    // No reintentar si ya se excedió el límite
    if (currentRetries >= this.config.retries) {
      return false;
    }

    // Reintentar solo para errores de red o códigos 5xx
    const isNetworkError = !error.response;
    const isServerError = error.response?.status && error.response.status >= 500;
    const isTimeoutError = error.code === 'ECONNABORTED';

    return isNetworkError || isServerError || isTimeoutError;
  }

  /**
   * Reintenta un request
   */
  private async retryRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const requestKey = this.getRequestKey(config);
    const currentRetries = this.retryCount.get(requestKey) || 0;
    
    this.retryCount.set(requestKey, currentRetries + 1);

    // Esperar antes del reintento
    await this.delay(this.config.retryDelay * Math.pow(2, currentRetries));

    return this.axiosInstance(config);
  }

  /**
   * Genera una clave única para el request
   */
  private getRequestKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`;
  }

  /**
   * Formatea errores de la API
   */
  private formatError(error: AxiosError): ApiError {
    const response = error.response;
    
    if (response?.data && typeof response.data === 'object' && 'success' in response.data) {
      // Error formateado por el backend
      return response.data as ApiError;
    }

    // Error genérico
    return {
      success: false,
      message: error.message || 'Error de conexión',
      error: error.code,
      timestamp: new Date().toISOString(),
      path: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };
  }

  /**
   * Limpia datos de autenticación
   */
  private clearAuth(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      localStorage.removeItem(AUTH_CONFIG.refreshTokenKey);
      localStorage.removeItem(AUTH_CONFIG.userKey);
    } catch (error) {
      console.warn('Error clearing auth data:', error);
    }
  }

  /**
   * Utilidad para delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===============================================
  // MÉTODOS PÚBLICOS
  // ===============================================

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * Upload de archivo
   */
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.axiosInstance.post<ApiResponse<T>>(url, formData, config);
    return response.data;
  }

  /**
   * Download de archivo
   */
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
    });

    // Crear URL temporal para el blob
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);

    // Crear link temporal y disparar descarga
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * Request genérico personalizable
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.request<ApiResponse<T>>({
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params,
      headers: config.headers,
      timeout: config.timeout,
    });
    return response.data;
  }

  /**
   * Actualiza la URL base del cliente
   */
  updateBaseURL(baseURL: string): void {
    this.config.baseURL = baseURL;
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  /**
   * Obtiene la URL base actual
   */
  getBaseURL(): string {
    return this.config.baseURL;
  }

  /**
   * Verifica si hay conexión con el servidor
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// ===============================================
// FACTORY PARA CREAR CLIENTES
// ===============================================

/**
 * Crea un cliente HTTP configurado
 */
export function createHttpClient(config: Partial<HttpClientConfig> = {}): HttpClient {
  const defaultConfig: HttpClientConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
  };

  return new HttpClient({ ...defaultConfig, ...config });
}

// ===============================================
// INSTANCIAS PREDEFINIDAS
// ===============================================

// Cliente principal (se configura según el backend activo)
export const apiClient = createHttpClient();

// Cliente específico para SQL Server
export const sqlServerClient = createHttpClient({
  baseURL: process.env.NEXT_PUBLIC_SQLSERVER_URL || 'http://localhost:3000',
});

// Cliente específico para MongoDB
export const mongoClient = createHttpClient({
  baseURL: process.env.NEXT_PUBLIC_MONGODB_URL || 'http://localhost:3001',
});

// ===============================================
// UTILIDADES
// ===============================================

/**
 * Cambia el backend activo
 */
export function switchBackend(backendType: BackendType): void {
  const baseURL = backendType === 'sqlserver' 
    ? process.env.NEXT_PUBLIC_SQLSERVER_URL || 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_MONGODB_URL || 'http://localhost:3001';
  
  apiClient.updateBaseURL(baseURL);
  
  console.log(`🔄 Backend cambiado a: ${backendType} (${baseURL})`);
}

/**
 * Obtiene el cliente específico según el tipo de backend
 */
export function getBackendClient(backendType: BackendType): HttpClient {
  return backendType === 'sqlserver' ? sqlServerClient : mongoClient;
}

/**
 * Detecta automáticamente el backend disponible
 */
export async function detectAvailableBackend(): Promise<BackendType | null> {
  try {
    // Intentar SQL Server primero
    const sqlServerAvailable = await sqlServerClient.healthCheck();
    if (sqlServerAvailable) {
      return 'sqlserver';
    }

    // Intentar MongoDB
    const mongoAvailable = await mongoClient.healthCheck();
    if (mongoAvailable) {
      return 'mongodb';
    }

    return null;
  } catch (error) {
    console.error('Error detecting backend:', error);
    return null;
  }
}