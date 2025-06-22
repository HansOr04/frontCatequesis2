// ===============================================
// COMPONENTE TOOLTIP - Sistema de Catequesis
// ===============================================

import React, { useState, useRef, useEffect, useCallback, forwardRef, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';

/**
 * Props para el componente Tooltip
 */
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  disabled?: boolean;
  delay?: number;
  hideDelay?: number;
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
  maxWidth?: number;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

/**
 * Hook para calcular la posición del tooltip
 */
const useTooltipPosition = (
  triggerRef: React.RefObject<HTMLElement | null>, // Permitir null
  tooltipRef: React.RefObject<HTMLDivElement | null>, // Permitir null
  placement: TooltipProps['placement'] = 'top'
) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let top = 0;
    let left = 0;
    const offset = 8; // Distancia entre el elemento y el tooltip

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'top-start':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left;
        break;
      case 'top-end':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.right - tooltipRect.width;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        left = triggerRect.right - tooltipRect.width;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + offset;
        break;
      default:
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
    }

    // Ajustar si se sale del viewport
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewport.width - 8) {
      left = viewport.width - tooltipRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewport.height - 8) {
      top = viewport.height - tooltipRect.height - 8;
    }

    setPosition({ top, left });
  };

  return { position, calculatePosition };
};

/**
 * Componente Arrow para el tooltip
 */
const TooltipArrow = ({ placement }: { placement: TooltipProps['placement'] }) => {
  const arrowClasses = cn(
    'absolute w-2 h-2 bg-gray-900 transform rotate-45',
    {
      'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2': placement === 'top',
      'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2': placement === 'bottom',
      'right-0 top-1/2 -translate-y-1/2 translate-x-1/2': placement === 'left',
      'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2': placement === 'right',
      'bottom-0 left-2 translate-y-1/2': placement === 'top-start',
      'bottom-0 right-2 translate-y-1/2': placement === 'top-end',
      'top-0 left-2 -translate-y-1/2': placement === 'bottom-start',
      'top-0 right-2 -translate-y-1/2': placement === 'bottom-end'
    }
  );

  return <div className={arrowClasses} />;
};

/**
 * Componente Tooltip principal
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      placement = 'top',
      trigger = 'hover',
      disabled = false,
      delay = 200,
      hideDelay = 100,
      className,
      contentClassName,
      arrow = true,
      maxWidth = 300,
      visible: controlledVisible,
      onVisibleChange,
      ...props
    },
    ref
  ) => {
    const [internalVisible, setInternalVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    const triggerRef = useRef<HTMLElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Usar visible controlado o interno
    const isVisible = controlledVisible !== undefined ? controlledVisible : internalVisible;

    // Calcular posición
    const { position, calculatePosition } = useTooltipPosition(triggerRef, tooltipRef, placement);

    // Efectos del ciclo de vida
    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    useEffect(() => {
      if (isVisible) {
        calculatePosition();
        window.addEventListener('scroll', calculatePosition);
        window.addEventListener('resize', calculatePosition);
        
        return () => {
          window.removeEventListener('scroll', calculatePosition);
          window.removeEventListener('resize', calculatePosition);
        };
      }
    }, [isVisible, calculatePosition]);

    // Limpiar timeouts al desmontar
    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, []);

    // Funciones para mostrar/ocultar
    const showTooltip = () => {
      if (disabled) return;
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      timeoutRef.current = setTimeout(() => {
        if (controlledVisible === undefined) {
          setInternalVisible(true);
        }
        onVisibleChange?.(true);
      }, delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      hideTimeoutRef.current = setTimeout(() => {
        if (controlledVisible === undefined) {
          setInternalVisible(false);
        }
        onVisibleChange?.(false);
      }, hideDelay);
    };

    const toggleTooltip = () => {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    };

    // Event handlers basados en el trigger
    const getEventHandlers = () => {
      switch (trigger) {
        case 'hover':
          return {
            onMouseEnter: showTooltip,
            onMouseLeave: hideTooltip,
            onFocus: showTooltip,
            onBlur: hideTooltip
          };
        case 'click':
          return {
            onClick: toggleTooltip
          };
        case 'focus':
          return {
            onFocus: showTooltip,
            onBlur: hideTooltip
          };
        case 'manual':
        default:
          return {};
      }
    };

    // Clonar el elemento hijo con los event handlers
    const eventHandlers = getEventHandlers();
    const triggerElement = cloneElement(children, {
    ...eventHandlers,
    ref: (node: HTMLElement | null) => {
        if (node) {
          triggerRef.current = node;
        }
        
        // Mantener la ref del componente hijo si existe
        const { ref: childRef } = children as any;
        if (typeof childRef === 'function') {
          childRef(node);
        } else if (childRef && 'current' in childRef) {
          childRef.current = node;
        }
      }
    } as any);

    // Renderizar el tooltip
    const tooltipContent = mounted && isVisible ? (
      <div
        ref={tooltipRef}
        className={cn(
          'fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
          'transition-opacity duration-200',
          'pointer-events-none select-none',
          contentClassName
        )}
        style={{
          top: position.top,
          left: position.left,
          maxWidth
        }}
        role="tooltip"
        {...props}
      >
        {content}
        {arrow && <TooltipArrow placement={placement} />}
      </div>
    ) : null;

    return (
      <>
        {triggerElement}
        {tooltipContent && createPortal(tooltipContent, document.body)}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

/**
 * Componente Tooltip simple para casos básicos
 */
export const SimpleTooltip = forwardRef<HTMLDivElement, {
  text: string;
  children: React.ReactElement;
  placement?: TooltipProps['placement'];
}>(({ text, children, placement = 'top' }, ref) => (
  <Tooltip
    ref={ref}
    content={text}
    placement={placement}
  >
    {children}
  </Tooltip>
));

SimpleTooltip.displayName = 'SimpleTooltip';

/**
 * Componente InfoTooltip para ayuda contextual
 */
export const InfoTooltip = forwardRef<HTMLDivElement, {
  title?: string;
  description: string;
  placement?: TooltipProps['placement'];
  className?: string;
}>(({ title, description, placement = 'top', className }, ref) => {
  const InfoIcon = () => (
    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const content = (
    <div className="max-w-xs">
      {title && (
        <div className="font-medium text-white mb-1">{title}</div>
      )}
      <div className="text-gray-200 text-xs leading-relaxed">{description}</div>
    </div>
  );

  return (
    <Tooltip
      ref={ref}
      content={content}
      placement={placement}
      contentClassName="bg-gray-800"
      maxWidth={280}
    >
      <span className={cn('inline-flex items-center', className)}>
        <InfoIcon />
      </span>
    </Tooltip>
  );
});

InfoTooltip.displayName = 'InfoTooltip';

export default Tooltip;