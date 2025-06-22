// ===============================================
// COMPONENTE SELECT - Sistema de Catequesis
// ===============================================

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { SelectProps, SelectOption } from '@/lib/types/ui';
import { cn } from '@/lib/utils/cn';

/**
 * Iconos para el select
 */
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={cn(
      'w-5 h-5 text-gray-400 transition-transform duration-200',
      isOpen && 'transform rotate-180'
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * Hook para manejar clics fuera del componente
 */
const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
};

/**
 * Componente Select principal
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      placeholder = 'Seleccionar...',
      multiple = false,
      searchable = false,
      clearable = false,
      loading = false,
      disabled = false,
      error,
      label,
      helper,
      size = 'md',
      fullWidth = false,
      className,
      onChange,
      onSearch,
      renderOption,
      renderValue,
      maxHeight = 200,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [internalValue, setInternalValue] = useState(
      defaultValue !== undefined ? defaultValue : multiple ? [] : null
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || containerRef;

    // Usar valor controlado o interno
    const currentValue = value !== undefined ? value : internalValue;

    // Cerrar dropdown cuando se hace clic fuera
    useClickOutside(combinedRef, () => setIsOpen(false));

    // Filtrar opciones basándose en búsqueda
    const filteredOptions = searchable && searchTerm
      ? options.filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (option.searchableText && option.searchableText.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : options;

    // Obtener opciones seleccionadas
    const selectedOptions = multiple 
      ? options.filter(option => (currentValue as any[])?.includes(option.value))
      : options.find(option => option.value === currentValue);

    // Manejar selección
    const handleSelect = (option: SelectOption) => {
      let newValue: any;

      if (multiple) {
        const currentArray = (currentValue as any[]) || [];
        newValue = currentArray.includes(option.value)
          ? currentArray.filter(v => v !== option.value)
          : [...currentArray, option.value];
      } else {
        newValue = option.value;
        setIsOpen(false);
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue, multiple ? 
        options.filter(opt => (newValue as any[]).includes(opt.value)) : 
        option
      );
    };

    // Manejar limpiar selección
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = multiple ? [] : null;
      
      if (value === undefined) {
        setInternalValue(newValue);
      }
      
      onChange?.(newValue);
    };

    // Manejar búsqueda
    const handleSearch = (term: string) => {
      setSearchTerm(term);
      onSearch?.(term);
    };

    // Renderizar valor seleccionado
    const renderSelectedValue = () => {
      if (multiple) {
        const selected = selectedOptions as SelectOption[];
        if (!selected?.length) return placeholder;
        
        if (selected.length === 1) {
          return renderValue ? renderValue(selected[0]) : selected[0].label;
        }
        
        return `${selected.length} seleccionados`;
      }

      const selected = selectedOptions as SelectOption | undefined;
      if (!selected) return placeholder;
      
      return renderValue ? renderValue(selected) : selected.label;
    };

    // Clases del input
    const inputClasses = cn(
      'w-full flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
      {
        'text-sm': size === 'sm' || size === 'md', 
        'text-base py-3': size === 'lg',
        'border-gray-300 bg-white': !error && !disabled,
        'border-red-300 bg-red-50': error,
        'border-gray-200 bg-gray-50 cursor-not-allowed': disabled,
        'text-gray-500': !currentValue || (multiple && !(currentValue as any[])?.length),
        'text-gray-900': currentValue && (!multiple || (currentValue as any[])?.length)
      },
      className
    );

    // Generar ID único
    const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('relative', fullWidth && 'w-full')} ref={combinedRef} {...props}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={selectId}
            className={cn(
              'block text-sm font-medium mb-1',
              error ? 'text-red-700' : 'text-gray-700'
            )}
          >
            {label}
          </label>
        )}

        {/* Select Input */}
        <div
          id={selectId}
          className={inputClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              !disabled && setIsOpen(!isOpen);
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
        >
          <span className="flex-1 truncate">
            {renderSelectedValue()}
          </span>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Botón limpiar */}
            {clearable && currentValue && (!multiple || (currentValue as any[])?.length) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded"
                tabIndex={-1}
              >
                <CloseIcon />
              </button>
            )}
            
            {/* Spinner de loading */}
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            )}
            
            {/* Chevron */}
            <ChevronDownIcon isOpen={isOpen} />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Campo de búsqueda */}
            {searchable && (
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Lista de opciones */}
            <div 
              className="max-h-60 overflow-y-auto py-1"
              style={{ maxHeight }}
              role="listbox"
            >
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">Cargando...</span>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple
                    ? (currentValue as any[])?.includes(option.value)
                    : currentValue === option.value;

                  return (
                    <div
                      key={option.value}
                      className={cn(
                        'flex items-center px-4 py-2 cursor-pointer text-sm transition-colors',
                        'hover:bg-gray-100',
                        isSelected && 'bg-blue-50 text-blue-700',
                        option.isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => !option.isDisabled && handleSelect(option)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {/* Checkbox o indicador de selección */}
                      {multiple && (
                        <div className="mr-3 flex-shrink-0">
                          {isSelected && <CheckIcon />}
                        </div>
                      )}

                      {/* Contenido de la opción */}
                      <div className="flex-1 min-w-0">
                        {renderOption ? renderOption(option) : (
                          <div>
                            <div className="font-medium">{option.label}</div>
                            {option.description && (
                              <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Indicador de selección para single select */}
                      {!multiple && isSelected && (
                        <div className="ml-2 flex-shrink-0">
                          <CheckIcon />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {/* Texto de ayuda */}
        {helper && !error && (
          <p className="mt-1 text-sm text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;