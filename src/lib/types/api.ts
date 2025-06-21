// ===============================================
// TIPOS DE API
// ===============================================

/**
 * Configuración de backend
 */
export type BackendType = 'sqlserver' | 'mongodb';

/**
 * Configuración de adaptador de backend
 */
export interface BackendAdapter {
  type: BackendType;
  baseURL: string;
  version: string;
  endpoints: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Respuesta estándar de la API (éxito)
 */
export interface ApiResponse<T = any> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
  meta?: {
    pagination?: PaginationMeta;
    filters?: FilterMeta;
    version?: string;
  };
}

/**
 * Respuesta de error de la API
 */
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  details?: any;
  code?: string | number;
  timestamp: string;
  path?: string;
  method?: string;
}

/**
 * Metadatos de paginación
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Metadatos de filtros
 */
export interface FilterMeta {
  applied: Record<string, any>;
  available: string[];
  count: number;
}

/**
 * Parámetros de filtros
 */
export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  parroquiaId?: string;
  nivelId?: string;
  grupoId?: string;
  [key: string]: any;
}

/**
 * Parámetros de consulta combinados
 */
export interface QueryParams extends PaginationParams, FilterParams {
  include?: string[];
  fields?: string[];
}

/**
 * Respuesta con lista paginada
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
  filters?: FilterMeta;
}

/**
 * Configuración de request HTTP
 */
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

/**
 * Configuración de cliente HTTP
 */
export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
  interceptors: {
    request: Array<(config: RequestConfig) => RequestConfig>;
    response: Array<(response: any) => any>;
    error: Array<(error: any) => any>;
  };
}

/**
 * Estado de request
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hook de API estado
 */
export interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  status: RequestStatus;
}

/**
 * Opciones de hook de API
 */
export interface UseApiOptions {
  enabled?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Mutación de API
 */
export interface ApiMutation<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  error: ApiError | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  reset: () => void;
}

/**
 * Configuración de endpoints
 */
export interface EndpointConfig {
  [key: string]: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    auth?: boolean;
    cache?: boolean;
    timeout?: number;
  };
}

/**
 * Respuesta de salud del sistema
 */
export interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  database: {
    status: 'connected' | 'disconnected' | 'error';
    responseTime?: number;
    details?: any;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  services: Array<{
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime?: number;
    lastCheck: string;
  }>;
}

/**
 * Respuesta de estadísticas
 */
export interface StatsResponse {
  catequizandos: {
    total: number;
    activos: number;
    inactivos: number;
    nuevos: number;
  };
  catequistas: {
    total: number;
    activos: number;
  };
  grupos: {
    total: number;
    activos: number;
  };
  certificados: {
    emitidos: number;
    pendientes: number;
  };
  asistencia: {
    promedio: number;
    ultimaSemana: number;
  };
}

/**
 * Parámetros de búsqueda
 */
export interface SearchParams {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  limit?: number;
  highlight?: boolean;
}

/**
 * Resultado de búsqueda
 */
export interface SearchResult<T> {
  items: Array<T & {
    score?: number;
    highlights?: Record<string, string[]>;
  }>;
  total: number;
  took: number;
  query: string;
  suggestions?: string[];
}

/**
 * Configuración de exportación
 */
export interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  fields?: string[];
  filters?: FilterParams;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  filename?: string;
  template?: string;
}

/**
 * Respuesta de exportación
 */
export interface ExportResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  format: string;
  expiresAt: string;
}

/**
 * Configuración de importación
 */
export interface ImportConfig {
  file: File;
  format: 'csv' | 'excel' | 'json';
  mapping?: Record<string, string>;
  validateOnly?: boolean;
  skipErrors?: boolean;
}

/**
 * Respuesta de importación
 */
export interface ImportResponse {
  success: boolean;
  processed: number;
  imported: number;
  errors: number;
  warnings: number;
  details: {
    errors?: Array<{
      row: number;
      field: string;
      message: string;
      value: any;
    }>;
    warnings?: Array<{
      row: number;
      field: string;
      message: string;
      value: any;
    }>;
  };
}