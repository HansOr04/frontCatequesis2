// ===============================================
// COMPONENTE ALERT - Sistema de Catequesis
// ===============================================

import React, { useState, useEffect, forwardRef } from 'react';
import { AlertProps } from '@/lib/types/ui';
import { cn } from '@/lib/utils/cn';

/**
 * Iconos para diferentes tipos de alert
 */
const AlertIcons = {
  success: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  neutral: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  )
};

/**
 * Icono de cerrar
 */
const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * Configuración de estilos por tipo de alert
 */
const alertVariants = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-400',
    title: 'text-green-800',
    description: 'text-green-700',
    closeButton: 'text-green-500 hover:text-green-600 focus:ring-green-600'
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-400',
    title: 'text-red-800', 
    description: 'text-red-700',
    closeButton: 'text-red-500 hover:text-red-600 focus:ring-red-600'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    description: 'text-yellow-700',
    closeButton: 'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-600'
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    description: 'text-blue-700',
    closeButton: 'text-blue-500 hover:text-blue-600 focus:ring-blue-600'
  },
  neutral: {
    container: 'bg-gray-50 border-gray-200 text-gray-800',
    icon: 'text-gray-400',
    title: 'text-gray-800',
    description: 'text-gray-700',
    closeButton: 'text-gray-500 hover:text-gray-600 focus:ring-gray-600'
  }
};

/**
 * Componente Alert principal
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      description,
      children,
      showIcon = true,
      closable = false,
      onClose,
      actions,
      className,
      autoClose,
      autoCloseDelay = 5000,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    // Auto-close functionality
    useEffect(() => {
      if (autoClose && autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }, [autoClose, autoCloseDelay]);

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) return null;

    const variant = alertVariants[type];
    const IconComponent = AlertIcons[type] || AlertIcons.info;

    return (
      <div
        ref={ref}
        className={cn(
          'border rounded-lg p-4 transition-all duration-300',
          variant.container,
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex">
          {/* Icono */}
          {showIcon && (
            <div className="flex-shrink-0">
              <div className={variant.icon}>
                <IconComponent />
              </div>
            </div>
          )}

          {/* Contenido */}
          <div className={cn('flex-1', showIcon && 'ml-3')}>
            {/* Título */}
            {title && (
              <h3 className={cn('text-sm font-medium', variant.title)}>
                {title}
              </h3>
            )}

            {/* Descripción */}
            {description && (
              <div className={cn(
                'text-sm mt-1',
                variant.description,
                title && 'mt-1'
              )}>
                {description}
              </div>
            )}

            {/* Contenido personalizado */}
            {children && (
              <div className={cn(
                'text-sm',
                (title || description) && 'mt-2'
              )}>
                {children}
              </div>
            )}

            {/* Acciones */}
            {actions && (
              <div className="mt-4">
                <div className="flex space-x-3">
                  {actions}
                </div>
              </div>
            )}
          </div>

          {/* Botón de cerrar */}
          {closable && (
            <div className="flex-shrink-0 ml-3">
              <button
                type="button"
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  variant.closeButton
                )}
                onClick={handleClose}
                aria-label="Cerrar alerta"
              >
                <CloseIcon />
              </button>
            </div>
          )}
        </div>

        {/* Barra de progreso para auto-close */}
        {autoClose && autoCloseDelay > 0 && (
          <div className="mt-3">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
              <div 
                className={cn(
                  'h-1 rounded-full transition-all ease-linear',
                  {
                    'bg-green-500': type === 'success',
                    'bg-red-500': type === 'error',
                    'bg-yellow-500': type === 'warning',
                    'bg-blue-500': type === 'info',
                    'bg-gray-500': type === 'neutral'
                  }
                )}
                style={{
                  animation: `shrink ${autoCloseDelay}ms linear forwards`
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

/**
 * Componente para alerts de toast/notificación
 */
export const Toast = forwardRef<HTMLDivElement, AlertProps & {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}>(({ position = 'top-right', className, ...props }, ref) => {
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
    'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'
  };

  return (
    <Alert
      ref={ref}
      className={cn(
        positionClasses[position],
        'max-w-sm shadow-lg',
        className
      )}
      {...props}
    />
  );
});

Toast.displayName = 'Toast';

/**
 * Componente para alerts en línea
 */
export const InlineAlert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, ...props }, ref) => (
    <Alert
      ref={ref}
      className={cn('border-0 rounded-none bg-transparent p-3', className)}
      showIcon={false}
      {...props}
    />
  )
);

InlineAlert.displayName = 'InlineAlert';

/**
 * Componente para alerts de banner
 */
export const BannerAlert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, ...props }, ref) => (
    <Alert
      ref={ref}
      className={cn('rounded-none border-x-0 border-t-0 px-6 py-4', className)}
      {...props}
    />
  )
);

BannerAlert.displayName = 'BannerAlert';

/**
 * CSS para la animación de auto-close
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
document.head.appendChild(style);

export default Alert;