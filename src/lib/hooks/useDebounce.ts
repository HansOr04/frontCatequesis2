// ===============================================
// HOOK DE DEBOUNCE
// ===============================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook básico de debounce
 * Retrasa la actualización de un valor hasta que haya pasado un tiempo sin cambios
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook de debounce con callback
 * Ejecuta una función después de que haya pasado un tiempo sin llamadas
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Actualizar la referencia del callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]) as T;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedCallback, cancel];
}

/**
 * Hook para búsquedas con debounce
 * Útil para campos de búsqueda que llaman a una API
 */
export function useSearch(
  searchFn: (query: string) => Promise<any>,
  delay: number = 300,
  minLength: number = 2
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, delay);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minLength) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const searchResults = await searchFn(searchQuery);
      setResults(searchResults);
    } catch (err: any) {
      setError(err.message || 'Error en la búsqueda');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchFn, minLength]);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error,
    clearSearch,
    hasResults: results.length > 0,
    showResults: query.length >= minLength,
  };
}

/**
 * Hook para auto-guardado con debounce
 * Útil para formularios que se guardan automáticamente
 */
export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay: number = 2000,
  options: {
    enabled?: boolean;
    onSaveStart?: () => void;
    onSaveSuccess?: () => void;
    onSaveError?: (error: any) => void;
  } = {}
) {
  const { enabled = true, onSaveStart, onSaveSuccess, onSaveError } = options;
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const debouncedData = useDebounce(data, delay);
  const initialDataRef = useRef(data);
  const hasSavedRef = useRef(false);

  const saveData = useCallback(async (dataToSave: T) => {
    if (!enabled) return;

    setIsSaving(true);
    setSaveError(null);
    onSaveStart?.();

    try {
      await saveFn(dataToSave);
      setLastSaved(new Date());
      hasSavedRef.current = true;
      onSaveSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || 'Error al guardar';
      setSaveError(errorMessage);
      onSaveError?.(error);
    } finally {
      setIsSaving(false);
    }
  }, [enabled, saveFn, onSaveStart, onSaveSuccess, onSaveError]);

  useEffect(() => {
    // No guardar en la primera carga
    if (!hasSavedRef.current && JSON.stringify(debouncedData) === JSON.stringify(initialDataRef.current)) {
      return;
    }

    saveData(debouncedData);
  }, [debouncedData, saveData]);

  const forceSave = useCallback(() => {
    return saveData(data);
  }, [data, saveData]);

  return {
    isSaving,
    lastSaved,
    saveError,
    forceSave,
    clearError: () => setSaveError(null),
  };
}

/**
 * Hook para control de input con debounce avanzado
 * Incluye validación y manejo de estado
 */
export function useDebouncedInput(
  initialValue: string = '',
  delay: number = 300,
  validator?: (value: string) => string | null
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    if (validator && debouncedValue !== initialValue) {
      setIsValidating(true);
      
      try {
        const validationError = validator(debouncedValue);
        setError(validationError);
      } catch (err: any) {
        setError(err.message || 'Error de validación');
      } finally {
        setIsValidating(false);
      }
    }
  }, [debouncedValue, validator, initialValue]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  return {
    value,
    setValue,
    debouncedValue,
    error,
    isValidating,
    isValid: !error && !isValidating,
    reset,
  };
}

/**
 * Hook para filtros con debounce
 * Útil para filtros de tablas o listas
 */
export function useDebouncedFilters<T extends Record<string, any>>(
  initialFilters: T,
  delay: number = 500
) {
  const [filters, setFilters] = useState<T>(initialFilters);
  const debouncedFilters = useDebounce(filters, delay);

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

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key];
    return value !== undefined && value !== null && value !== '';
  });

  return {
    filters,
    debouncedFilters,
    setFilters,
    updateFilter,
    removeFilter,
    resetFilters,
    hasActiveFilters,
  };
}

/**
 * Hook para resize con debounce
 * Útil para eventos de resize de ventana
 */
export function useDebouncedResize(delay: number = 150) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [debouncedCallback] = useDebouncedCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, delay);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', debouncedCallback);
    
    return () => {
      window.removeEventListener('resize', debouncedCallback);
    };
  }, [debouncedCallback]);

  return windowSize;
}

/**
 * Hook para scroll con debounce
 * Útil para eventos de scroll optimizados
 */
export function useDebouncedScroll(delay: number = 100) {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  const lastScrollY = useRef(0);

  const [debouncedCallback] = useDebouncedCallback(() => {
    const currentScrollY = window.scrollY;
    
    setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
    setScrollY(currentScrollY);
    lastScrollY.current = currentScrollY;
  }, delay);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', debouncedCallback);
    
    return () => {
      window.removeEventListener('scroll', debouncedCallback);
    };
  }, [debouncedCallback]);

  return {
    scrollY,
    scrollDirection,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up',
  };
}

/**
 * Hook para throttle (alternativa a debounce)
 * Ejecuta la función máximo una vez por período de tiempo
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

export default useDebounce;