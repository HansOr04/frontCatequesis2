// ===============================================
// COMPONENTE AVATAR - Sistema de Catequesis
// ===============================================

import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Props para el componente Avatar
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  fallback?: React.ReactNode;
  showBorder?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
  badge?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

/**
 * Variantes de tamaño para el avatar
 */
const avatarSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl'
};

/**
 * Variantes de forma para el avatar
 */
const avatarShapes = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg'
};

/**
 * Configuración de estados de presencia
 */
const statusConfig = {
  online: 'bg-green-400 border-2 border-white',
  offline: 'bg-gray-400 border-2 border-white',
  busy: 'bg-red-400 border-2 border-white',
  away: 'bg-yellow-400 border-2 border-white'
};

/**
 * Función para generar initiales a partir del nombre
 */
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/**
 * Función para generar un color de fondo basado en el nombre
 */
const getBackgroundColor = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-yellow-500', 
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-orange-500'
  ];
  
  const charCode = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return colors[charCode % colors.length];
};

/**
 * Componente Avatar principal
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name = '',
      size = 'md',
      shape = 'circle',
      fallback,
      showBorder = false,
      status,
      badge,
      onClick,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(!!src);

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
    };

    // Determinar qué mostrar
    const showImage = src && !imageError && !loading;
    const showInitials = !showImage && name && !fallback;
    const showFallback = !showImage && !showInitials && fallback;
    const showDefaultIcon = !showImage && !showInitials && !showFallback;

    // Classes del container
    const containerClasses = cn(
      'relative inline-flex items-center justify-center flex-shrink-0 font-medium',
      'transition-all duration-200',
      avatarSizes[size],
      avatarShapes[shape],
      showBorder && 'ring-2 ring-gray-300',
      onClick && 'cursor-pointer hover:opacity-80',
      loading && 'animate-pulse bg-gray-200',
      showInitials && getBackgroundColor(name),
      showInitials && 'text-white',
      (showFallback || showDefaultIcon) && 'bg-gray-100 text-gray-400',
      className
    );

    // Classes del indicador de estado
    const statusClasses = cn(
      'absolute bottom-0 right-0 rounded-full',
      statusConfig[status || 'offline'],
      {
        'w-2 h-2': size === 'xs' || size === 'sm',
        'w-3 h-3': size === 'md' || size === 'lg',
        'w-4 h-4': size === 'xl' || size === '2xl'
      }
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {/* Imagen */}
        {showImage && (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn(
              'w-full h-full object-cover',
              avatarShapes[shape]
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Loading state */}
        {(loading || imageLoading) && (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={cn(
                'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
                {
                  'w-3 h-3': size === 'xs',
                  'w-4 h-4': size === 'sm',
                  'w-5 h-5': size === 'md',
                  'w-6 h-6': size === 'lg',
                  'w-8 h-8': size === 'xl',
                  'w-10 h-10': size === '2xl'
                }
              )}
            />
          </div>
        )}

        {/* Iniciales */}
        {showInitials && !loading && !imageLoading && (
          <span className="select-none">
            {getInitials(name)}
          </span>
        )}

        {/* Fallback personalizado */}
        {showFallback && !loading && !imageLoading && fallback}

        {/* Icono por defecto */}
        {showDefaultIcon && !loading && !imageLoading && (
          <svg
            className={cn(
              'text-gray-400',
              {
                'w-4 h-4': size === 'xs' || size === 'sm',
                'w-6 h-6': size === 'md' || size === 'lg',
                'w-8 h-8': size === 'xl',
                'w-10 h-10': size === '2xl'
              }
            )}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}

        {/* Indicador de estado */}
        {status && (
          <span className={statusClasses} />
        )}

        {/* Badge personalizado */}
        {badge && (
          <span className="absolute -top-1 -right-1">
            {badge}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

/**
 * Componente AvatarGroup para mostrar múltiples avatares
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
  spacing?: 'tight' | 'normal' | 'loose';
  size?: AvatarProps['size'];
  showTooltip?: boolean;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children,
      max = 5,
      spacing = 'normal',
      size = 'md',
      showTooltip = true,
      className,
      ...props
    },
    ref
  ) => {
    const avatars = React.Children.toArray(children) as React.ReactElement<AvatarProps>[];
    const visibleAvatars = avatars.slice(0, max);
    const hiddenCount = Math.max(0, avatars.length - max);

    const spacingClasses = {
      tight: '-space-x-1',
      normal: '-space-x-2',
      loose: 'space-x-1'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {/* Avatares visibles */}
        {visibleAvatars.map((avatar, index) => (
          <div
            key={index}
            className="relative z-10 ring-2 ring-white"
            style={{ zIndex: visibleAvatars.length - index }}
          >
            {React.cloneElement(avatar, {
              size: avatar.props.size || size,
              shape: avatar.props.shape || 'circle'
            })}
          </div>
        ))}

        {/* Contador de avatares ocultos */}
        {hiddenCount > 0 && (
          <div className="relative z-0">
            <Avatar
              size={size}
              shape="circle"
              className="bg-gray-200 text-gray-600 ring-2 ring-white"
            >
              <span className="text-xs font-medium">+{hiddenCount}</span>
            </Avatar>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

/**
 * Avatar específico para catequistas
 */
export const CatequistaAvatar = forwardRef<HTMLDivElement, {
  catequista: {
    nombres: string;
    apellidos: string;
    foto?: string;
    activo?: boolean;
  };
  size?: AvatarProps['size'];
  showStatus?: boolean;
  onClick?: () => void;
}>(({ catequista, size = 'md', showStatus = true, onClick }, ref) => {
  const fullName = `${catequista.nombres} ${catequista.apellidos}`;
  
  return (
    <Avatar
      ref={ref}
      src={catequista.foto}
      name={fullName}
      alt={`Foto de ${fullName}`}
      size={size}
      status={showStatus ? (catequista.activo ? 'online' : 'offline') : undefined}
      onClick={onClick}
      showBorder
    />
  );
});

CatequistaAvatar.displayName = 'CatequistaAvatar';

export default Avatar;