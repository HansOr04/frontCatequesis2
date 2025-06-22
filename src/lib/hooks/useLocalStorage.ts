// ===============================================
// HOOK DE LOCAL STORAGE
// ===============================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Opciones para el hook useLocalStorage
 */
interface UseLocalStorageOptions<T> {
  serializer?: {
    read: (value: string) => T;
    write: (value: T) => string;
  };
  syncAcrossTabs?: boolean;
  onError?: (error: Error) => void;
}

/**
 * Serializador por defecto para JSON
 */
const defaultSerializer = {
  read: (value: string) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  },
  write: (value: any) => JSON.stringify(value),
};

/**
 * Hook para manejar localStorage con React
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = defaultSerializer,
    syncAcrossTabs = true,
    onError,
  } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return serializer.read(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      onError?.(error as Error);
      return initialValue;
    }
  });

  const setValueRef = useRef<((value: T | ((prev: T) => T)) => void) | null>(null);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Permitir función como valor para comportamiento similar a useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer.write(valueToStore));
        
        // Disparar evento personalizado para sincronización entre tabs
        if (syncAcrossTabs) {
          window.dispatchEvent(new CustomEvent('local-storage', {
            detail: { key, value: valueToStore }
          }));
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      onError?.(error as Error);
    }
  }, [key, serializer, storedValue, syncAcrossTabs, onError]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        // Disparar evento para sincronización
        if (syncAcrossTabs) {
          window.dispatchEvent(new CustomEvent('local-storage', {
            detail: { key, value: undefined }
          }));
        }
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      onError?.(error as Error);
    }
  }, [key, initialValue, syncAcrossTabs, onError]);

  setValueRef.current = setValue;

  // Sincronización entre tabs
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if ('detail' in e) {
        // Evento personalizado
        const { key: eventKey, value } = e.detail;
        if (eventKey === key) {
          setStoredValue(value !== undefined ? value : initialValue);
        }
      } else {
        // Evento nativo de storage
        if (e.key === key && e.newValue !== null) {
          try {
            setStoredValue(serializer.read(e.newValue));
          } catch (error) {
            console.warn(`Error parsing storage event for key "${key}":`, error);
            onError?.(error as Error);
          }
        } else if (e.key === key && e.newValue === null) {
          setStoredValue(initialValue);
        }
      }
    };

    // Escuchar cambios de storage entre tabs
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
    };
  }, [key, initialValue, serializer, syncAcrossTabs, onError]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook simplificado para strings
 */
export function useLocalStorageString(
  key: string,
  initialValue: string = ''
): [string, (value: string | ((prev: string) => string)) => void, () => void] {
  return useLocalStorage(key, initialValue, {
    serializer: {
      read: (value: string) => value,
      write: (value: string) => value,
    },
  });
}

/**
 * Hook simplificado para números
 */
export function useLocalStorageNumber(
  key: string,
  initialValue: number = 0
): [number, (value: number | ((prev: number) => number)) => void, () => void] {
  return useLocalStorage(key, initialValue, {
    serializer: {
      read: (value: string) => {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? initialValue : parsed;
      },
      write: (value: number) => value.toString(),
    },
  });
}

/**
 * Hook simplificado para booleanos
 */
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false
): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void, () => void] {
  return useLocalStorage(key, initialValue, {
    serializer: {
      read: (value: string) => value === 'true',
      write: (value: boolean) => value.toString(),
    },
  });
}

/**
 * Hook para arrays
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
): [T[], (value: T[] | ((prev: T[]) => T[])) => void, () => void] {
  return useLocalStorage(key, initialValue);
}

/**
 * Hook para objetos con validación de esquema
 */
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  initialValue: T,
  validator?: (value: any) => value is T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  return useLocalStorage(key, initialValue, {
    serializer: {
      read: (value: string) => {
        try {
          const parsed = JSON.parse(value);
          if (validator && !validator(parsed)) {
            console.warn(`Invalid object structure for key "${key}", using initial value`);
            return initialValue;
          }
          return parsed;
        } catch (error) {
          console.warn(`Error parsing object for key "${key}":`, error);
          return initialValue;
        }
      },
      write: (value: T) => JSON.stringify(value),
    },
  });
}

/**
 * Hook para configuraciones de usuario
 */
export function useUserPreferences<T extends Record<string, any>>(
  defaults: T,
  validator?: (value: any) => value is T
) {
  const [preferences, setPreferences, clearPreferences] = useLocalStorageObject(
    'user-preferences',
    defaults,
    validator
  );

  const updatePreference = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaults);
  }, [setPreferences, defaults]);

  return {
    preferences,
    setPreferences,
    updatePreference,
    resetPreferences,
    clearPreferences,
  };
}

/**
 * Hook para tema de la aplicación
 */
export function useThemePreference() {
  const [theme, setTheme] = useLocalStorageString('theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const setLightTheme = useCallback(() => setTheme('light'), [setTheme]);
  const setDarkTheme = useCallback(() => setTheme('dark'), [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
  };
}

/**
 * Hook para historial de búsquedas
 */
export function useSearchHistory(maxItems: number = 10) {
  const [history, setHistory] = useLocalStorageArray<string>('search-history', []);

  const addToHistory = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setHistory(prev => {
      const filteredHistory = prev.filter(item => item !== searchTerm);
      const newHistory = [searchTerm, ...filteredHistory];
      return newHistory.slice(0, maxItems);
    });
  }, [setHistory, maxItems]);

  const removeFromHistory = useCallback((searchTerm: string) => {
    setHistory(prev => prev.filter(item => item !== searchTerm));
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

/**
 * Hook para estado de sidebar/navegación
 */
export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useLocalStorageBoolean('sidebar-collapsed', false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, [setIsCollapsed]);

  const collapseSidebar = useCallback(() => {
    setIsCollapsed(true);
  }, [setIsCollapsed]);

  const expandSidebar = useCallback(() => {
    setIsCollapsed(false);
  }, [setIsCollapsed]);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return {
    isCollapsed,
    isMobileOpen,
    setIsCollapsed,
    setIsMobileOpen,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
  };
}

/**
 * Hook para configuración de tabla (columnas visibles, orden, etc.)
 */
export function useTableConfig<T extends string>(
  tableId: string,
  defaultColumns: T[],
  defaultSortColumn?: T,
  defaultSortOrder: 'asc' | 'desc' = 'asc'
) {
  interface TableConfig {
    visibleColumns: T[];
    sortColumn?: T;
    sortOrder: 'asc' | 'desc';
    pageSize: number;
  }

  const defaultConfig: TableConfig = {
    visibleColumns: defaultColumns,
    sortColumn: defaultSortColumn,
    sortOrder: defaultSortOrder,
    pageSize: 10,
  };

  const [config, setConfig] = useLocalStorageObject(
    `table-config-${tableId}`,
    defaultConfig
  );

  const updateVisibleColumns = useCallback((columns: T[]) => {
    setConfig(prev => ({ ...prev, visibleColumns: columns }));
  }, [setConfig]);

  const updateSort = useCallback((column: T, order: 'asc' | 'desc') => {
    setConfig(prev => ({ ...prev, sortColumn: column, sortOrder: order }));
  }, [setConfig]);

  const updatePageSize = useCallback((pageSize: number) => {
    setConfig(prev => ({ ...prev, pageSize }));
  }, [setConfig]);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, [setConfig, defaultConfig]);

  return {
    config,
    setConfig,
    updateVisibleColumns,
    updateSort,
    updatePageSize,
    resetConfig,
  };
}

export default useLocalStorage;