// ===============================================
// COMPONENTE CARD - Sistema de Catequesis
// ===============================================

import React, { forwardRef } from 'react';
import { CardProps } from '@/lib/types/ui';
import { cn } from '@/lib/utils/cn';

// Re-exportar el tipo
export type { CardProps };

/**
 * Variantes de estilo para la card
 */
const cardVariants = {
  variant: {
    elevated: 'bg-white shadow-md border border-gray-200',
    outlined: 'bg-white border-2 border-gray-200 shadow-sm',
    filled: 'bg-gray-50 border border-gray-200',
    flat: 'bg-white'
  },
  padding: {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  },
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-2xl'
  }
};

/**
 * Componente Card Header
 */
export const CardHeader = forwardRef<HTMLDivElement, {
  children?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}>(({ children, className, padding = 'md' }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'border-b border-gray-200',
      cardVariants.padding[padding],
      className
    )}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

/**
 * Componente Card Body
 */
export const CardBody = forwardRef<HTMLDivElement, {
  children?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}>(({ children, className, padding = 'md' }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'flex-1',
      cardVariants.padding[padding],
      className
    )}
  >
    {children}
  </div>
));

CardBody.displayName = 'CardBody';

/**
 * Componente Card Footer
 */
export const CardFooter = forwardRef<HTMLDivElement, {
  children?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}>(({ children, className, padding = 'md' }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'border-t border-gray-200',
      cardVariants.padding[padding],
      className
    )}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

/**
 * Componente Card principal
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'elevated',
      padding = 'md',
      rounded = 'md',
      hoverable = false,
      clickable = false,
      fullWidth = false,
      fullHeight = false,
      header,
      footer,
      title,
      subtitle,
      extra,
      loading = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = clickable || !!onClick;

    return (
      <div
        ref={ref}
        className={cn(
          // Estilos base
          'transition-all duration-200 overflow-hidden',
          
          // Variantes
          cardVariants.variant[variant],
          cardVariants.rounded[rounded as keyof typeof cardVariants.rounded],
          
          // Interactividad
          {
            'cursor-pointer transform hover:scale-[1.02] hover:shadow-lg': 
              hoverable || isInteractive,
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2': 
              isInteractive
          },
          
          // Tamaños
          fullWidth && 'w-full',
          fullHeight && 'h-full',
          
          // Estado de loading
          loading && 'opacity-60 pointer-events-none',
          
          className
        )}
        onClick={onClick}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        {...props}
      >
        {/* Indicador de loading */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Cargando...</span>
            </div>
          </div>
        )}

        {/* Header personalizado o automático */}
        {(header || title || subtitle || extra) && (
          <CardHeader padding={padding}>
            {header || (
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-500 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
                {extra && (
                  <div className="flex-shrink-0 ml-4">
                    {extra}
                  </div>
                )}
              </div>
            )}
          </CardHeader>
        )}

        {/* Contenido principal */}
        <CardBody padding={children && !header && !footer ? padding : 'none'}>
          {children}
        </CardBody>

        {/* Footer */}
        {footer && (
          <CardFooter padding={padding}>
            {footer}
          </CardFooter>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Componente Card simple para casos básicos
 */
export const SimpleCard = forwardRef<HTMLDivElement, {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}>(({ children, className, title, padding = 'md' }, ref) => (
  <Card ref={ref} className={className} padding="none">
    {title && (
      <CardHeader padding={padding}>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </CardHeader>
    )}
    <CardBody padding={padding}>
      {children}
    </CardBody>
  </Card>
));

SimpleCard.displayName = 'SimpleCard';

/**
 * Componente Card de estadísticas
 */
export const StatsCard = forwardRef<HTMLDivElement, {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}>(({ title, value, subtitle, icon, trend, className }, ref) => (
  <Card ref={ref} className={className} variant="elevated" isHoverable>
    <CardBody>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center text-sm mt-2',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <span className={cn(
                'inline-flex items-center',
                trend.isPositive ? '↗' : '↘'
              )}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </CardBody>
  </Card>
));

StatsCard.displayName = 'StatsCard';

export default Card;