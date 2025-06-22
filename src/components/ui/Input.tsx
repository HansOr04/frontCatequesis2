// ===============================================
// COMPONENTE INPUT - Sistema de Catequesis
// ===============================================

import React, { forwardRef, useState } from 'react';
import { InputProps } from '@/lib/types/ui';
import { cn } from '@/lib/utils/cn';

/**
 * Icono de ojo para mostrar/ocultar contraseña
 */
const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {isVisible ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
      />
    )}
  </svg>
);

/**
 * Icono de error/alerta
 */
const AlertIcon = () => (
  <svg
    className="w-5 h-5 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

/**
 * Componente Input reutilizable y accesible
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helper,
      leftElement,
      rightElement,
      isInvalid = false,
      size = 'md',
      variant = 'outline',
      fullWidth = false,
      showPasswordToggle = false,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalType, setInternalType] = useState(type);
    
    // Generar ID único si no se proporciona
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Manejar toggle de contraseña
    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
      setInternalType(showPassword ? 'password' : 'text');
    };

    // Determinar si hay error
    const hasError = isInvalid || !!error;

    // Clases base del input
    const inputBaseClasses = cn(
      'block w-full rounded-lg border transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'placeholder:text-gray-400',
      
      // Tamaños
      {
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-2.5 text-sm': size === 'md',
        'px-4 py-3 text-base': size === 'lg'
      },
      
      // Variantes y estados
      {
        // Variante outline normal
        'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500': 
          variant === 'outline' && !hasError,
        
        // Variante outline con error
        'border-red-300 bg-white text-gray-900 focus:border-red-500 focus:ring-red-500': 
          variant === 'outline' && hasError,
        
        // Variante filled normal
        'border-transparent bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-blue-500': 
          variant === 'filled' && !hasError,
        
        // Variante filled con error
        'border-transparent bg-red-50 text-gray-900 focus:bg-white focus:border-red-500 focus:ring-red-500': 
          variant === 'filled' && hasError
      },
      
      // Padding para elementos internos
      {
        'pl-10': !!leftElement,
        'pr-10': !!rightElement || (type === 'password' && showPasswordToggle),
        'pr-16': !!rightElement && (type === 'password' && showPasswordToggle)
      },
      
      className
    );

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium',
              hasError ? 'text-red-700' : 'text-gray-700'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Container del input */}
        <div className="relative">
          {/* Elemento izquierdo */}
          {leftElement && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftElement}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type === 'password' && showPasswordToggle ? internalType : type}
            id={inputId}
            className={inputBaseClasses}
            aria-invalid={hasError}
            aria-describedby={
              cn(
                error && `${inputId}-error`,
                helper && `${inputId}-helper`
              ) || undefined
            }
            {...props}
          />

          {/* Elementos derechos */}
          <div className="absolute inset-y-0 right-0 flex items-center">
            {/* Icono de error */}
            {hasError && !rightElement && (
              <div className="pr-3">
                <AlertIcon />
              </div>
            )}
            
            {/* Toggle de contraseña */}
            {type === 'password' && showPasswordToggle && (
              <button
                type="button"
                className="pr-3 hover:text-gray-600 focus:outline-none"
                onClick={handlePasswordToggle}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <EyeIcon isVisible={!showPassword} />
              </button>
            )}
            
            {/* Elemento derecho personalizado */}
            {rightElement && (
              <div className="pr-3 flex items-center">
                {rightElement}
              </div>
            )}
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-red-600 flex items-center"
          >
            <AlertIcon />
            <span className="ml-1">{error}</span>
          </p>
        )}

        {/* Texto de ayuda */}
        {helper && !error && (
          <p 
            id={`${inputId}-helper`}
            className="text-sm text-gray-500"
          >
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;