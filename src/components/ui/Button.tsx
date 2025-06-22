// ===============================================
// COMPONENTE BUTTON - Sistema de Catequesis
// ===============================================

import React, { forwardRef } from 'react';
import { ButtonProps } from '@/lib/types/ui';
import { cn } from '@/lib/utils/cn';

/**
 * Variantes de estilo para el botón
 */
const buttonVariants = {
  variant: {
    solid: 'text-white font-medium shadow-sm',
    outline: 'border-2 bg-transparent font-medium',
    ghost: 'bg-transparent font-medium hover:bg-opacity-10',
    link: 'bg-transparent underline-offset-4 hover:underline font-medium',
    soft: 'font-medium'
  },
  color: {
    primary: {
      solid: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      ghost: 'text-blue-600 hover:bg-blue-600',
      link: 'text-blue-600 hover:text-blue-700',
      soft: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
    },
    secondary: {
      solid: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-600 hover:bg-gray-600',
      link: 'text-gray-600 hover:text-gray-700',
      soft: 'bg-gray-50 text-gray-700 hover:bg-gray-100'
    },
    success: {
      solid: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      outline: 'border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
      ghost: 'text-green-600 hover:bg-green-600',
      link: 'text-green-600 hover:text-green-700',
      soft: 'bg-green-50 text-green-700 hover:bg-green-100'
    },
    warning: {
      solid: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400',
      outline: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-400',
      ghost: 'text-yellow-600 hover:bg-yellow-500',
      link: 'text-yellow-600 hover:text-yellow-700',
      soft: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
    },
    error: {
      solid: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      outline: 'border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
      ghost: 'text-red-600 hover:bg-red-600',
      link: 'text-red-600 hover:text-red-700',
      soft: 'bg-red-50 text-red-700 hover:bg-red-100'
    },
    info: {
      solid: 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500',
      outline: 'border-cyan-600 text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-500',
      ghost: 'text-cyan-600 hover:bg-cyan-600',
      link: 'text-cyan-600 hover:text-cyan-700',
      soft: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
    },
    neutral: {
      solid: 'bg-slate-600 hover:bg-slate-700 focus:ring-slate-500',
      outline: 'border-slate-600 text-slate-600 hover:bg-slate-50 focus:ring-slate-500',
      ghost: 'text-slate-600 hover:bg-slate-600',
      link: 'text-slate-600 hover:text-slate-700',
      soft: 'bg-slate-50 text-slate-700 hover:bg-slate-100'
    }
  },
  size: {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
};

/**
 * Icono de loading para el botón
 */
const LoadingSpinner = ({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  return (
    <svg
      className={cn('animate-spin', sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

/**
 * Componente Button reutilizable y accesible
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'solid',
      color = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      loadingText,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const disabled = isDisabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          // Estilos base
          'inline-flex items-center justify-center',
          'border border-transparent rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variantes de estilo
          buttonVariants.variant[variant],
          buttonVariants.color[color][variant],
          buttonVariants.size[size],
          
          // Full width
          fullWidth && 'w-full',
          
          // Estados especiales
          isLoading && 'cursor-wait',
          
          className
        )}
        {...props}
      >
        {/* Icono izquierdo o spinner de loading */}
        {isLoading ? (
          <LoadingSpinner size={size} />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}

        {/* Texto del botón */}
        <span className={cn(isLoading && leftIcon && 'ml-2')}>
          {isLoading && loadingText ? loadingText : children}
        </span>

        {/* Icono derecho */}
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;