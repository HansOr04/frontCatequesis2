// ===============================================
// COMPONENTE LOADING - Sistema de Catequesis
// ===============================================

import React, { forwardRef } from 'react';
import { LoadingProps } from '@/lib/types/ui';
import { cn } from '@/lib/utils/cn';

/**
 * Variantes de tamaño para los spinners
 */
const spinnerSizes = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5', 
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

/**
 * Spinner circular básico
 */
const CircularSpinner = ({ size = 'md', className }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }) => (
  <div
    className={cn(
      'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
      spinnerSizes[size],
      className
    )}
  />
);

/**
 * Spinner de puntos
 */
const DotsSpinner = ({ size = 'md', className }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }) => {
  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2', 
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-blue-600 rounded-full animate-pulse',
            dotSizes[size]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Spinner de barras
 */
const BarsSpinner = ({ size = 'md', className }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }) => {
  const barSizes = {
    xs: { width: 'w-0.5', heights: ['h-2', 'h-3', 'h-2'] },
    sm: { width: 'w-0.5', heights: ['h-3', 'h-4', 'h-3'] },
    md: { width: 'w-1', heights: ['h-4', 'h-6', 'h-4'] },
    lg: { width: 'w-1', heights: ['h-6', 'h-8', 'h-6'] },
    xl: { width: 'w-1.5', heights: ['h-8', 'h-12', 'h-8'] }
  };

  const { width, heights } = barSizes[size];

  return (
    <div className={cn('flex items-end space-x-1', className)}>
      {heights.map((height, i) => (
        <div
          key={i}
          className={cn(
            'bg-blue-600 animate-pulse',
            width,
            height
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Spinner de pulso
 */
const PulseSpinner = ({ size = 'md', className }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }) => (
  <div className={cn('relative', className)}>
    <div
      className={cn(
        'animate-ping absolute rounded-full bg-blue-400 opacity-75',
        spinnerSizes[size]
      )}
    />
    <div
      className={cn(
        'relative rounded-full bg-blue-600',
        spinnerSizes[size]
      )}
    />
  </div>
);

/**
 * Spinner personalizado de la Iglesia
 */
const ChurchSpinner = ({ size = 'md', className }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }) => {
  const crossSizes = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={cn('relative', className)}>
      <svg
        className={cn('animate-spin text-blue-600', crossSizes[size])}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8C18 9.1 17.1 10 16 10H14V12H16C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16H14V18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18V16H8C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12H10V10H8C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6H10V4C10 2.9 10.9 2 12 2Z" />
      </svg>
    </div>
  );
};

/**
 * Componente Loading principal
 */
export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      size = 'md',
      variant = 'circular',
      text,
      overlay = false,
      fullScreen = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Seleccionar el spinner basándose en la variante
    const renderSpinner = () => {
      const spinnerProps = { size, className: 'flex-shrink-0' };

      switch (variant) {
        case 'dots':
          return <DotsSpinner {...spinnerProps} />;
        case 'bars':
          return <BarsSpinner {...spinnerProps} />;
        case 'pulse':
          return <PulseSpinner {...spinnerProps} />;
        case 'church':
          return <ChurchSpinner {...spinnerProps} />;
        case 'circular':
        default:
          return <CircularSpinner {...spinnerProps} />;
      }
    };

    const content = (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          text ? 'space-x-3' : '',
          fullScreen && 'min-h-screen',
          overlay && 'absolute inset-0 bg-white bg-opacity-75 z-50',
          className
        )}
        {...props}
      >
        {renderSpinner()}
        {text && (
          <span className={cn(
            'text-gray-600 font-medium',
            {
              'text-xs': size === 'xs',
              'text-sm': size === 'sm',
              'text-base': size === 'md',
              'text-lg': size === 'lg',
              'text-xl': size === 'xl'
            }
          )}>
            {text}
          </span>
        )}
        {children}
      </div>
    );

    return content;
  }
);

Loading.displayName = 'Loading';

/**
 * Componente para loading de página completa
 */
export const PageLoading = forwardRef<HTMLDivElement, {
  title?: string;
  subtitle?: string;
  variant?: LoadingProps['variant'];
}>(({ title = 'Cargando...', subtitle, variant = 'church' }, ref) => (
  <Loading
    ref={ref}
    fullScreen
    variant={variant}
    size="lg"
    className="flex-col space-y-4 space-x-0"
  >
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 mt-2">{subtitle}</p>
      )}
    </div>
  </Loading>
));

PageLoading.displayName = 'PageLoading';

/**
 * Componente para loading de botones
 */
export const ButtonLoading = forwardRef<HTMLDivElement, {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: LoadingProps['variant'];
}>(({ size = 'sm', variant = 'circular' }, ref) => (
  <Loading
    ref={ref}
    size={size}
    variant={variant}
    className="inline-flex"
  />
));

ButtonLoading.displayName = 'ButtonLoading';

/**
 * Componente para loading de tabla
 */
export const TableLoading = forwardRef<HTMLDivElement, {
  rows?: number;
  columns?: number;
}>(({ rows = 5, columns = 4 }, ref) => (
  <div ref={ref} className="animate-pulse">
    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded flex-1"></div>
        ))}
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
));

TableLoading.displayName = 'TableLoading';

/**
 * Componente para loading de cards
 */
export const CardLoading = forwardRef<HTMLDivElement, {
  count?: number;
  showHeader?: boolean;
}>(({ count = 1, showHeader = true }, ref) => (
  <div ref={ref} className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        {showHeader && (
          <div className="mb-4">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        )}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
));

CardLoading.displayName = 'CardLoading';

export default Loading;