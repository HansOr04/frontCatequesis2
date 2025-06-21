// ===============================================
// UTILIDAD PARA COMBINACIÓN DE CLASES CSS
// ===============================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Función utilitaria para combinar clases de CSS de manera condicional
 * Combina clsx para lógica condicional y tailwind-merge para resolver conflictos de Tailwind
 * 
 * @param inputs - Clases CSS, objetos condicionales, arrays, etc.
 * @returns String con las clases CSS combinadas y optimizadas
 * 
 * @example
 * ```tsx
 * // Uso básico
 * cn('px-4', 'py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 * 
 * // Con condicionales
 * cn('px-4', 'py-2', {
 *   'bg-blue-500': isActive,
 *   'bg-gray-500': !isActive
 * })
 * 
 * // Resolviendo conflictos de Tailwind
 * cn('px-4 py-2', 'px-6') // => 'py-2 px-6'
 * cn('text-red-500', 'text-blue-500') // => 'text-blue-500'
 * 
 * // Con arrays
 * cn(['px-4', 'py-2'], 'bg-blue-500')
 * 
 * // Con undefined/null (se ignoran)
 * cn('px-4', undefined, null, 'py-2') // => 'px-4 py-2'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Función para crear variantes de componentes con clases base
 * Útil para crear sistemas de diseño consistentes
 * 
 * @param base - Clases CSS base que siempre se aplican
 * @param variants - Objeto con variantes del componente
 * @param defaultVariants - Variantes por defecto
 * 
 * @example
 * ```tsx
 * const buttonVariants = createVariants({
 *   base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors',
 *   variants: {
 *     variant: {
 *       default: 'bg-primary text-primary-foreground hover:bg-primary/90',
 *       destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
 *       outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
 *     },
 *     size: {
 *       default: 'h-10 px-4 py-2',
 *       sm: 'h-9 rounded-md px-3',
 *       lg: 'h-11 rounded-md px-8',
 *     },
 *   },
 *   defaultVariants: {
 *     variant: 'default',
 *     size: 'default',
 *   },
 * });
 * 
 * // Uso
 * buttonVariants({ variant: 'destructive', size: 'sm' })
 * ```
 */
export function createVariants<T extends Record<string, Record<string, string>>>(config: {
  base?: string;
  variants: T;
  defaultVariants?: {
    [K in keyof T]?: keyof T[K];
  };
}) {
  return (props?: {
    [K in keyof T]?: keyof T[K];
  } & { className?: string }) => {
    const { className, ...variantProps } = props || {};
    
    // Obtener clases de variantes
    const variantClasses = Object.entries(config.variants).map(([key, variants]) => {
      const variantKey = (variantProps as any)?.[key] || config.defaultVariants?.[key];
      return variantKey ? variants[variantKey as string] : '';
    });
    
    return cn(config.base, ...variantClasses, className);
  };
}

/**
 * Utilidad para aplicar clases condicionales basadas en estado
 * 
 * @param baseClasses - Clases base
 * @param conditionalClasses - Objeto con condiciones y clases
 * @param additionalClasses - Clases adicionales
 * 
 * @example
 * ```tsx
 * conditional(
 *   'px-4 py-2',
 *   {
 *     'bg-blue-500 text-white': isActive,
 *     'bg-gray-200 text-gray-800': !isActive,
 *     'opacity-50': isDisabled,
 *     'cursor-not-allowed': isDisabled,
 *   },
 *   className
 * )
 * ```
 */
export function conditional(
  baseClasses: string,
  conditionalClasses: Record<string, boolean>,
  additionalClasses?: string
): string {
  return cn(baseClasses, conditionalClasses, additionalClasses);
}

/**
 * Utilidad para crear clases de animación
 * 
 * @example
 * ```tsx
 * animate('fadeIn', 'duration-300', 'ease-in-out')
 * animate({ fadeIn: true, slideUp: isVisible })
 * ```
 */
export function animate(...classes: (string | Record<string, boolean>)[]): string {
  return cn('transition-all', ...classes);
}

/**
 * Utilidad para clases de hover
 * 
 * @example
 * ```tsx
 * hover('bg-blue-600', 'scale-105')
 * ```
 */
export function hover(...classes: string[]): string {
  return cn(classes.map(cls => `hover:${cls}`));
}

/**
 * Utilidad para clases de focus
 * 
 * @example
 * ```tsx
 * focus('ring-2', 'ring-blue-500', 'outline-none')
 * ```
 */
export function focus(...classes: string[]): string {
  return cn(classes.map(cls => `focus:${cls}`));
}

/**
 * Utilidad para clases responsive
 * 
 * @example
 * ```tsx
 * responsive({
 *   base: 'text-sm',
 *   sm: 'text-base',
 *   md: 'text-lg',
 *   lg: 'text-xl',
 * })
 * ```
 */
export function responsive(breakpoints: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  const classes: string[] = [];
  
  if (breakpoints.base) classes.push(breakpoints.base);
  if (breakpoints.sm) classes.push(`sm:${breakpoints.sm}`);
  if (breakpoints.md) classes.push(`md:${breakpoints.md}`);
  if (breakpoints.lg) classes.push(`lg:${breakpoints.lg}`);
  if (breakpoints.xl) classes.push(`xl:${breakpoints.xl}`);
  if (breakpoints['2xl']) classes.push(`2xl:${breakpoints['2xl']}`);
  
  return cn(...classes);
}

/**
 * Utilidad para crear clases de grid responsive
 * 
 * @example
 * ```tsx
 * grid({ cols: { base: 1, sm: 2, md: 3, lg: 4 } })
 * ```
 */
export function grid(config: {
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: string;
}): string {
  const classes: string[] = ['grid'];
  
  if (config.gap) {
    classes.push(`gap-${config.gap}`);
  }
  
  if (config.cols) {
    const { cols } = config;
    if (cols.base) classes.push(`grid-cols-${cols.base}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`);
  }
  
  return cn(...classes);
}

/**
 * Utilidad para crear clases de flex
 * 
 * @example
 * ```tsx
 * flex({ direction: 'col', align: 'center', justify: 'between' })
 * ```
 */
export function flex(config: {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: string;
}): string {
  const classes: string[] = ['flex'];
  
  if (config.direction) {
    classes.push(`flex-${config.direction}`);
  }
  
  if (config.wrap) {
    classes.push(`flex-${config.wrap}`);
  }
  
  if (config.align) {
    classes.push(`items-${config.align}`);
  }
  
  if (config.justify) {
    classes.push(`justify-${config.justify}`);
  }
  
  if (config.gap) {
    classes.push(`gap-${config.gap}`);
  }
  
  return cn(...classes);
}

/**
 * Utilidad para clases de posición
 * 
 * @example
 * ```tsx
 * position('absolute', { top: '4', right: '4' })
 * ```
 */
export function position(
  type: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky',
  coords?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    inset?: string;
  }
): string {
  const classes: string[] = [type];
  
  if (coords) {
    if (coords.inset) {
      classes.push(`inset-${coords.inset}`);
    } else {
      if (coords.top) classes.push(`top-${coords.top}`);
      if (coords.right) classes.push(`right-${coords.right}`);
      if (coords.bottom) classes.push(`bottom-${coords.bottom}`);
      if (coords.left) classes.push(`left-${coords.left}`);
    }
  }
  
  return cn(...classes);
}

/**
 * Utilidad para crear clases de tamaño
 * 
 * @example
 * ```tsx
 * size({ w: 'full', h: '64' })
 * size({ square: '12' })
 * ```
 */
export function size(config: {
  w?: string;
  h?: string;
  square?: string;
  minW?: string;
  minH?: string;
  maxW?: string;
  maxH?: string;
}): string {
  const classes: string[] = [];
  
  if (config.square) {
    classes.push(`w-${config.square}`, `h-${config.square}`);
  } else {
    if (config.w) classes.push(`w-${config.w}`);
    if (config.h) classes.push(`h-${config.h}`);
  }
  
  if (config.minW) classes.push(`min-w-${config.minW}`);
  if (config.minH) classes.push(`min-h-${config.minH}`);
  if (config.maxW) classes.push(`max-w-${config.maxW}`);
  if (config.maxH) classes.push(`max-h-${config.maxH}`);
  
  return cn(...classes);
}

/**
 * Utilidad para crear clases de espaciado
 * 
 * @example
 * ```tsx
 * spacing({ p: '4', mx: 'auto' })
 * spacing({ px: '6', py: '4' })
 * ```
 */
export function spacing(config: {
  p?: string;
  px?: string;
  py?: string;
  pt?: string;
  pr?: string;
  pb?: string;
  pl?: string;
  m?: string;
  mx?: string;
  my?: string;
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
}): string {
  const classes: string[] = [];
  
  // Padding
  if (config.p) classes.push(`p-${config.p}`);
  if (config.px) classes.push(`px-${config.px}`);
  if (config.py) classes.push(`py-${config.py}`);
  if (config.pt) classes.push(`pt-${config.pt}`);
  if (config.pr) classes.push(`pr-${config.pr}`);
  if (config.pb) classes.push(`pb-${config.pb}`);
  if (config.pl) classes.push(`pl-${config.pl}`);
  
  // Margin
  if (config.m) classes.push(`m-${config.m}`);
  if (config.mx) classes.push(`mx-${config.mx}`);
  if (config.my) classes.push(`my-${config.my}`);
  if (config.mt) classes.push(`mt-${config.mt}`);
  if (config.mr) classes.push(`mr-${config.mr}`);
  if (config.mb) classes.push(`mb-${config.mb}`);
  if (config.ml) classes.push(`ml-${config.ml}`);
  
  return cn(...classes);
}

/**
 * Utilidad para crear clases de texto
 * 
 * @example
 * ```tsx
 * text({ size: 'lg', weight: 'bold', color: 'blue-600' })
 * ```
 */
export function text(config: {
  size?: string;
  weight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  decoration?: 'underline' | 'overline' | 'line-through' | 'no-underline';
}): string {
  const classes: string[] = [];
  
  if (config.size) classes.push(`text-${config.size}`);
  if (config.weight) classes.push(`font-${config.weight}`);
  if (config.color) classes.push(`text-${config.color}`);
  if (config.align) classes.push(`text-${config.align}`);
  if (config.transform) classes.push(config.transform);
  if (config.decoration) classes.push(config.decoration);
  
  return cn(...classes);
}

/**
 * Utilidad para crear clases de borde
 * 
 * @example
 * ```tsx
 * border({ width: '2', color: 'gray-300', radius: 'lg' })
 * ```
 */
export function border(config: {
  width?: string;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  radius?: string;
  side?: 't' | 'r' | 'b' | 'l' | 'x' | 'y';
}): string {
  const classes: string[] = [];
  
  const prefix = config.side ? `border-${config.side}` : 'border';
  
  if (config.width) {
    classes.push(config.side ? `${prefix}-${config.width}` : `border-${config.width}`);
  } else {
    classes.push(prefix);
  }
  
  if (config.color) classes.push(`border-${config.color}`);
  if (config.style) classes.push(`border-${config.style}`);
  if (config.radius) classes.push(`rounded-${config.radius}`);
  
  return cn(...classes);
}

/**
 * Utilidad para crear clases de sombra
 * 
 * @example
 * ```tsx
 * shadow('lg')
 * shadow('md', 'blue-500/25')
 * ```
 */
export function shadow(size?: string, color?: string): string {
  const classes: string[] = [];
  
  if (size) {
    classes.push(size === 'none' ? 'shadow-none' : `shadow-${size}`);
  } else {
    classes.push('shadow');
  }
  
  if (color) {
    classes.push(`shadow-${color}`);
  }
  
  return cn(...classes);
}

// Export por defecto de la función principal
export default cn;