// ===============================================
// COMPONENTE MODAL - Sistema de Catequesis
// ===============================================

import React, { useEffect, useRef, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from '@/lib/types/ui';
import { cn } from '@/lib/utils/cn';

/**
 * Icono de X para cerrar modal
 */
const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

/**
 * Variantes de tamaño para el modal
 */
const modalSizes = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-full mx-4'
};

/**
 * Hook para manejar el escape del modal
 */
const useEscapeKey = (onEscape: () => void, isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onEscape, isOpen]);
};

/**
 * Hook para prevenir scroll del body cuando el modal está abierto
 */
const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
};

/**
 * Hook para el foco del modal
 */
const useFocusManagement = (isOpen: boolean, modalRef: React.RefObject<HTMLDivElement>) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus en el modal después de un pequeño delay para que la animación termine
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (focusableElement) {
            focusableElement.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 100);
    } else {
      // Restaurar el foco cuando se cierre el modal
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, modalRef]);
};

/**
 * Componente Modal Header
 */
export const ModalHeader = forwardRef<HTMLDivElement, {
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}>(({ children, className, onClose, showCloseButton = true }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'flex items-center justify-between p-6 border-b border-gray-200',
      className
    )}
  >
    <div className="flex-1 min-w-0">
      {children}
    </div>
    {showCloseButton && onClose && (
      <button
        type="button"
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
        onClick={onClose}
        aria-label="Cerrar modal"
      >
        <CloseIcon />
      </button>
    )}
  </div>
));

ModalHeader.displayName = 'ModalHeader';

/**
 * Componente Modal Body
 */
export const ModalBody = forwardRef<HTMLDivElement, {
  children?: React.ReactNode;
  className?: string;
  padding?: boolean;
}>(({ children, className, padding = true }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'flex-1',
      padding && 'p-6',
      className
    )}
  >
    {children}
  </div>
));

ModalBody.displayName = 'ModalBody';

/**
 * Componente Modal Footer
 */
export const ModalFooter = forwardRef<HTMLDivElement, {
  children?: React.ReactNode;
  className?: string;
}>(({ children, className }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50',
      className
    )}
  >
    {children}
  </div>
));

ModalFooter.displayName = 'ModalFooter';

/**
 * Componente Modal principal
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      isOpen = false,
      onClose,
      title,
      size = 'md',
      centered = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      className,
      overlayClassName,
      footer,
      loading = false,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || modalRef;

    // Hooks para funcionalidad del modal
    useBodyScrollLock(isOpen);
    useFocusManagement(isOpen, combinedRef);
    
    if (closeOnEscape && onClose) {
      useEscapeKey(onClose, isOpen);
    }

    // Manejar click en overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && onClose && e.target === e.currentTarget) {
        onClose();
      }
    };

    // No renderizar si está cerrado
    if (!isOpen) return null;

    const modalContent = (
      <div
        className={cn(
          'fixed inset-0 z-50 overflow-y-auto',
          overlayClassName
        )}
        onClick={handleOverlayClick}
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        {/* Container del modal */}
        <div className={cn(
          'relative min-h-full flex items-center justify-center p-4',
          !centered && 'items-start pt-16'
        )}>
          {/* Modal */}
          <div
            ref={combinedRef}
            className={cn(
              'relative bg-white rounded-lg shadow-xl max-h-[90vh] w-full flex flex-col',
              'transform transition-all duration-300',
              'focus:outline-none',
              modalSizes[size],
              loading && 'opacity-60 pointer-events-none',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            tabIndex={-1}
            {...props}
          >
            {/* Indicador de loading */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Cargando...</span>
                </div>
              </div>
            )}

            {/* Header */}
            {title && (
              <ModalHeader onClose={onClose} showCloseButton={showCloseButton}>
                <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              </ModalHeader>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <ModalFooter>
                {footer}
              </ModalFooter>
            )}
          </div>
        </div>
      </div>
    );

    // Usar portal para renderizar el modal en el body
    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

/**
 * Modal de confirmación
 */
export const ConfirmModal = forwardRef<HTMLDivElement, {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger' | 'info';
  loading?: boolean;
}>(({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  loading = false
}, ref) => {
  const variantStyles = {
    warning: 'bg-yellow-50 text-yellow-800',
    danger: 'bg-red-50 text-red-800', 
    info: 'bg-blue-50 text-blue-800'
  };

  const buttonStyles = {
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  };

  return (
    <Modal
      ref={ref}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      loading={loading}
      footer={
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
              buttonStyles[variant]
            )}
          >
            {loading ? 'Procesando...' : confirmText}
          </button>
        </div>
      }
    >
      <ModalBody>
        <div className={cn('p-4 rounded-lg', variantStyles[variant])}>
          <p className="text-sm">{message}</p>
        </div>
      </ModalBody>
    </Modal>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

export default Modal;