// ===============================================
// COMPONENTE BADGE - Sistema de Catequesis
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Props para el componente Badge
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'outline' | 'soft' | 'dot';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  pulse?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

/**
 * Variantes de estilo para el badge
 */
const badgeVariants = {
  variant: {
    solid: 'text-white font-medium',
    outline: 'border-2 bg-transparent font-medium',
    soft: 'font-medium',
    dot: 'relative'
  },
  color: {
    primary: {
      solid: 'bg-blue-600',
      outline: 'border-blue-600 text-blue-600',
      soft: 'bg-blue-100 text-blue-800',
      dot: 'bg-blue-600'
    },
    secondary: {
      solid: 'bg-gray-600',
      outline: 'border-gray-600 text-gray-600', 
      soft: 'bg-gray-100 text-gray-800',
      dot: 'bg-gray-600'
    },
    success: {
      solid: 'bg-green-600',
      outline: 'border-green-600 text-green-600',
      soft: 'bg-green-100 text-green-800',
      dot: 'bg-green-600'
    },
    warning: {
      solid: 'bg-yellow-500',
      outline: 'border-yellow-500 text-yellow-600',
      soft: 'bg-yellow-100 text-yellow-800',
      dot: 'bg-yellow-500'
    },
    error: {
      solid: 'bg-red-600',
      outline: 'border-red-600 text-red-600',
      soft: 'bg-red-100 text-red-800',
      dot: 'bg-red-600'
    },
    info: {
      solid: 'bg-cyan-600',
      outline: 'border-cyan-600 text-cyan-600',
      soft: 'bg-cyan-100 text-cyan-800',
      dot: 'bg-cyan-600'
    },
    neutral: {
      solid: 'bg-slate-600',
      outline: 'border-slate-600 text-slate-600',
      soft: 'bg-slate-100 text-slate-800',
      dot: 'bg-slate-600'
    }
  },
  size: {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs', 
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm'
  }
};

/**
 * Icono de X para remover badge
 */
const RemoveIcon = () => (
  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * Componente Badge principal
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      variant = 'solid',
      color = 'primary',
      size = 'sm',
      pulse = false,
      removable = false,
      onRemove,
      ...props
    },
    ref
  ) => {
    if (variant === 'dot') {
      return (
        <span
          ref={ref}
          className={cn(
            'inline-flex items-center relative',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              badgeVariants.color[color][variant],
              pulse && 'animate-pulse'
            )}
          />
          {children && (
            <span className="ml-2 text-sm text-gray-700">{children}</span>
          )}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'transition-colors duration-200',
          
          // Variantes
          badgeVariants.variant[variant],
          badgeVariants.color[color][variant],
          badgeVariants.size[size],
          
          // Efectos
          pulse && 'animate-pulse',
          
          className
        )}
        {...props}
      >
        {children}
        
        {/* Botón de remover */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 hover:opacity-70 focus:outline-none focus:opacity-70 transition-opacity"
            aria-label="Remover"
          >
            <RemoveIcon />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

/**
 * Badge de estado para catequizandos
 */
export const StatusBadge = forwardRef<HTMLSpanElement, {
  status: 'activo' | 'inactivo' | 'completado' | 'pendiente' | 'suspendido';
  className?: string;
}>(({ status, className }, ref) => {
  const statusConfig = {
    activo: { color: 'success' as const, text: 'Activo' },
    inactivo: { color: 'neutral' as const, text: 'Inactivo' },
    completado: { color: 'info' as const, text: 'Completado' },
    pendiente: { color: 'warning' as const, text: 'Pendiente' },
    suspendido: { color: 'error' as const, text: 'Suspendido' }
  };

  const config = statusConfig[status];

  return (
    <Badge
      ref={ref}
      variant="soft"
      color={config.color}
      className={className}
    >
      {config.text}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

/**
 * Badge de rol para usuarios
 */
export const RoleBadge = forwardRef<HTMLSpanElement, {
  role: 'admin' | 'coordinador' | 'catequista' | 'asistente';
  className?: string;
}>(({ role, className }, ref) => {
  const roleConfig = {
    admin: { color: 'primary' as const, text: 'Administrador' },
    coordinador: { color: 'info' as const, text: 'Coordinador' },
    catequista: { color: 'success' as const, text: 'Catequista' },
    asistente: { color: 'neutral' as const, text: 'Asistente' }
  };

  const config = roleConfig[role];

  return (
    <Badge
      ref={ref}
      variant="outline"
      color={config.color}
      className={className}
    >
      {config.text}
    </Badge>
  );
});

RoleBadge.displayName = 'RoleBadge';

/**
 * Badge contador (para notificaciones, etc.)
 */
export const CountBadge = forwardRef<HTMLSpanElement, {
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
}>(({ count, max = 99, showZero = false, className }, ref) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      ref={ref}
      variant="solid"
      color="error"
      size="xs"
      className={cn('min-w-[1.25rem] h-5', className)}
    >
      {displayCount}
    </Badge>
  );
});

CountBadge.displayName = 'CountBadge';

/**
 * Badge de nivel de catequesis
 */
export const NivelBadge = forwardRef<HTMLSpanElement, {
  nivel: string;
  color?: BadgeProps['color'];
  className?: string;
}>(({ nivel, color = 'primary', className }, ref) => {
  return (
    <Badge
      ref={ref}
      variant="soft"
      color={color}
      className={cn('font-medium', className)}
    >
      {nivel}
    </Badge>
  );
});

NivelBadge.displayName = 'NivelBadge';

export default Badge;