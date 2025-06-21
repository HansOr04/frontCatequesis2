// ===============================================
// HOOK DE API
// ===============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  ApiResponse, 
  ApiError, 
  RequestStatus, 
  UseApiState, 
  UseApiOptions,
  QueryParams,
  BackendType 
} from '../types/api';
import { useAuth } from './useAuth';

/**
 * Hook base para realizar requests a la API
 */
export function useApi<T = any>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiState<T> & {
  refetch: () => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: options.enabled !== false,
    isError: false,
    isSuccess: false,
    status: options.enabled !== false ? 'loading' : 'idle',
  });

  const { isAuthenticated } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  const executeRequest = useCallback(async () => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      isSuccess: false,
      status: 'loading',
      error: null,
    }));

    try {
      const response = await apiCall();

      // Verificar si el request fue cancelado
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setState({
        data: response.data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
        status: 'success',
      });

      retryCountRef.current = 0;
      options.onSuccess?.(response.data);
    } catch (error: any) {
      // Verificar si el request fue cancelado
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const apiError: ApiError = {
        success: false,
        message: error.message || 'Error en la solicitud',
        error: error.code,
        timestamp: new Date().toISOString(),
      };

      // Intentar retry si está configurado
      const shouldRetry = options.retry !== false && 
                         (typeof options.retry === 'number' ? retryCountRef.current < options.retry : retryCountRef.current < 3);

      if (shouldRetry && error.response?.status >= 500) {
        retryCountRef.current++;
        const delay = options.retryDelay || 1000 * Math.pow(2, retryCountRef.current - 1);
        
        setTimeout(() => {
          executeRequest();
        }, delay);
        return;
      }

      setState({
        data: null,
        error: apiError,
        isLoading: false,
        isError: true,
        isSuccess: false,
        status: 'error',
      });

      options.onError?.(apiError);
    }
  }, [apiCall, options]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
      status: 'idle',
    });
    
    retryCountRef.current = 0;
  }, []);

  // Ejecutar request inicial
  useEffect(() => {
    if (options.enabled !== false && isAuthenticated) {
      executeRequest();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [executeRequest, isAuthenticated, options.enabled]);

  // Refetch cuando regresa el foco a la ventana
  useEffect(() => {
    if (options.refetchOnWindowFocus !== false) {
      const handleFocus = () => {
        if (state.data && isAuthenticated) {
          executeRequest();
        }
      };

      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [executeRequest, state.data, isAuthenticated, options.refetchOnWindowFocus]);

  return {
    ...state,
    refetch: executeRequest,
    reset,
  };
}

/**
 * Hook para mutaciones (POST, PUT, DELETE)
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: ApiError, variables: TVariables) => void;
    onSettled?: (data: TData | null, error: ApiError | null, variables: TVariables) => void;
  } = {}
) {
  const [state, setState] = useState({
    data: null as TData | null,
    error: null as ApiError | null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const mutate = useCallback(async (variables: TVariables) => {
    setState({
      data: null,
      error: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
    });

    try {
      const response = await mutationFn(variables);
      
      setState({
        data: response.data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      options.onSuccess?.(response.data, variables);
      options.onSettled?.(response.data, null, variables);
      
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        success: false,
        message: error.message || 'Error en la mutación',
        error: error.code,
        timestamp: new Date().toISOString(),
      };

      setState({
        data: null,
        error: apiError,
        isLoading: false,
        isError: true,
        isSuccess: false,
      });

      options.onError?.(apiError, variables);
      options.onSettled?.(null, apiError, variables);
      
      throw error;
    }
  }, [mutationFn, options]);

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    return mutate(variables);
  }, [mutate]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    mutateAsync,
    reset,
  };
}

/**
 * Hook para obtener el adaptador correcto según el backend configurado
 */
export function useBackendAdapter() {
  const [currentBackend, setCurrentBackend] = useState<BackendType>(
    (process.env.NEXT_PUBLIC_BACKEND_TYPE as BackendType) || 'sqlserver'
  );

  const getAdapter = useCallback(async () => {
    if (currentBackend === 'sqlserver') {
      const { sqlServerAdapter } = await import('../api/adapters/sqlserver');
      return sqlServerAdapter;
    } else {
      const { mongoAdapter } = await import('../api/adapters/mongodb');
      return mongoAdapter;
    }
  }, [currentBackend]);

  const switchBackend = useCallback((backend: BackendType) => {
    setCurrentBackend(backend);
  }, []);

  return {
    currentBackend,
    getAdapter,
    switchBackend,
  };
}

/**
 * Hook para paginación
 */
export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNext) setPage(prev => prev + 1);
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) setPage(prev => prev - 1);
  }, [hasPrev]);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    setTotal(0);
  }, [initialPage, initialPageSize]);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext,
    hasPrev,
    setPage,
    setPageSize,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    reset,
    paginationParams: { page, limit: pageSize } as QueryParams,
  };
}

/**
 * Hook para filtros de búsqueda
 */
export function useFilters<T extends Record<string, any> = Record<string, any>>(
  initialFilters: T = {} as T
) {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [search, setSearch] = useState('');

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback(<K extends keyof T>(key: K) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearch('');
  }, [initialFilters]);

  const hasActiveFilters = Object.keys(filters).length > 0 || search.length > 0;

  return {
    filters,
    search,
    setFilters,
    setSearch,
    updateFilter,
    removeFilter,
    clearFilters,
    hasActiveFilters,
    queryParams: {
      ...filters,
      ...(search && { search }),
    } as QueryParams,
  };
}

/**
 * Hook combinado para listados con paginación y filtros
 */
export function useListData<T = any>(
  fetchFn: (params: QueryParams) => Promise<ApiResponse<{ items: T[]; pagination: any }>>,
  options: UseApiOptions & {
    initialPage?: number;
    initialPageSize?: number;
    initialFilters?: Record<string, any>;
  } = {}
) {
  const pagination = usePagination(options.initialPage, options.initialPageSize);
  const filters = useFilters(options.initialFilters);

  const queryParams: QueryParams = {
    ...pagination.paginationParams,
    ...filters.queryParams,
  };

  const apiCall = useCallback(() => fetchFn(queryParams), [fetchFn, queryParams]);
  const { data, error, isLoading, isError, isSuccess, refetch, reset } = useApi(apiCall, options);

  // Actualizar total cuando llegan nuevos datos
  useEffect(() => {
    if (data?.pagination?.total !== undefined) {
      pagination.setTotal(data.pagination.total);
    }
  }, [data?.pagination?.total, pagination]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const resetAll = useCallback(() => {
    pagination.reset();
    filters.clearFilters();
    reset();
  }, [pagination, filters, reset]);

  return {
    // Datos
    items: data?.items || [],
    total: pagination.total,
    
    // Estados
    isLoading,
    isError,
    isSuccess,
    error,
    
    // Paginación
    pagination,
    
    // Filtros
    filters,
    
    // Acciones
    refresh,
    reset: resetAll,
    refetch,
  };
}

export default useApi;