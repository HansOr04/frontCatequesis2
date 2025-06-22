/* ===============================================
   CONFIGURACIÓN COMPLETA DE TAILWIND CSS
   Sistema de Catequesis - Versión corregida
   =============================================== */

import type { Config } from 'tailwindcss';

const config: Config = {
  // Archivos a procesar
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Configuración del tema
  theme: {
    extend: {
      // ===============================================
      // COLORES DEL SISTEMA
      // ===============================================
      colors: {
        // Colores principales del sistema de catequesis
        primary: {
          25: '#f8fafc',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Color principal
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a', // Azul marino principal
          950: '#172554',
        },
        
        // Colores secundarios (grises)
        secondary: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        
        // Estados de éxito
        success: {
          25: '#f7fef9',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Verde principal
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        
        // Estados de advertencia
        warning: {
          25: '#fffcf5',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Naranja principal
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        
        // Estados de error
        error: {
          25: '#fffbfa',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Rojo principal
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        
        // Color de información (azul claro)
        info: {
          25: '#f0fdff',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        
        // Colores específicos del sistema de catequesis
        catequesis: {
          blue: '#1e3a8a',
          'blue-light': '#bfdbfe',
          orange: '#f59e0b',
          cream: '#fef3c7',
        },
      },

      // ===============================================
      // TIPOGRAFÍA
      // ===============================================
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Monaco', 'monospace'],
      },
      
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      // ===============================================
      // ESPACIADO
      // ===============================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },

      // ===============================================
      // SOMBRAS
      // ===============================================
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': '0 0 #0000',
        
        // Sombras personalizadas del sistema
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        
        // Sombras coloreadas
        'primary': '0 10px 25px -5px rgba(37, 99, 235, 0.25), 0 4px 6px -2px rgba(37, 99, 235, 0.05)',
        'success': '0 10px 25px -5px rgba(34, 197, 94, 0.25), 0 4px 6px -2px rgba(34, 197, 94, 0.05)',
        'warning': '0 10px 25px -5px rgba(245, 158, 11, 0.25), 0 4px 6px -2px rgba(245, 158, 11, 0.05)',
        'error': '0 10px 25px -5px rgba(239, 68, 68, 0.25), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',
      },

      // ===============================================
      // BORDES Y RADIOS
      // ===============================================
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },

      // ===============================================
      // TRANSICIONES Y ANIMACIONES
      // ===============================================
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-back': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },

      // ===============================================
      // ANIMACIONES PERSONALIZADAS
      // ===============================================
      keyframes: {
        // Animación de aparición
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        
        // Animación de deslizamiento hacia arriba
        'slide-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        
        // Animación de deslizamiento hacia abajo
        'slide-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        
        // Animación de escala
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        
        // Spinner de carga
        'spin': {
          'to': { transform: 'rotate(360deg)' },
        },
        
        // Pulso
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        
        // Bounce suave
        'bounce-soft': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        
        // Shake para errores
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        
        // Loading skeleton
        'skeleton': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in-up': 'slide-in-up 0.3s ease-out',
        'slide-in-down': 'slide-in-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-soft': 'bounce-soft 1s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'skeleton': 'skeleton 1.5s linear infinite',
      },

      // ===============================================
      // ASPECTOS Y PROPORCIONES
      // ===============================================
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },

      // ===============================================
      // DIMENSIONES ESPECÍFICAS
      // ===============================================
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        'screen-2xl': '1536px',
      },
      
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        'screen': '100vh',
        'screen-small': '100svh',
        'screen-dynamic': '100dvh',
      },

      // ===============================================
      // Z-INDEX LAYERS
      // ===============================================
      zIndex: {
        'hide': '-1',
        'auto': 'auto',
        'base': '0',
        'docked': '10',
        'dropdown': '1000',
        'sticky': '1100',
        'banner': '1200',
        'overlay': '1300',
        'modal': '1400',
        'popover': '1500',
        'skipLink': '1600',
        'toast': '1700',
        'tooltip': '1800',
      },

      // ===============================================
      // TIPOGRAFÍA ADICIONAL
      // ===============================================
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      
      lineHeight: {
        '3': '.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
      },
    },
  },

  // ===============================================
  // PLUGINS DE TAILWIND
  // ===============================================
  plugins: [
    // Plugin para formularios
    require('@tailwindcss/forms')({
      strategy: 'class', // usar estrategia de clases en lugar de global
    }),
    
    // Plugin para tipografía
    require('@tailwindcss/typography'),
    
    // Plugin para aspect-ratio (aunque ya está incluido en Tailwind 3.15+)
    require('@tailwindcss/aspect-ratio'),
    
    // Plugin personalizado para utilidades del sistema
    function({ addUtilities, addComponents, theme }: {
      addUtilities: (utilities: Record<string, any>) => void;
      addComponents: (components: Record<string, any>) => void;
      theme: (path: string) => any;
    }) {
      // Utilidades personalizadas
      const newUtilities = {
        // Scrollbar personalizado
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        
        // Scrollbar estilizado
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('colors.secondary.300')} ${theme('colors.secondary.100')}`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.secondary.100'),
            borderRadius: theme('borderRadius.full'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.secondary.300'),
            borderRadius: theme('borderRadius.full'),
            '&:hover': {
              background: theme('colors.secondary.400'),
            },
          },
        },
        
        // Text gradients
        '.text-gradient-primary': {
          background: `linear-gradient(135deg, ${theme('colors.primary.600')}, ${theme('colors.primary.800')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        
        '.text-gradient-success': {
          background: `linear-gradient(135deg, ${theme('colors.success.500')}, ${theme('colors.success.700')})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        
        // Safe area para dispositivos móviles
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        
        '.safe-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        
        '.safe-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
      };
      
      // Componentes base del sistema
      const newComponents = {
        // Botón base
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.5'),
          borderRadius: theme('borderRadius.md'),
          border: '1px solid transparent',
          transition: 'all 150ms ease-in-out',
          cursor: 'pointer',
          textDecoration: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
          
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}1a`,
          },
        },
        
        // Card base
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.card'),
          overflow: 'hidden',
          transition: 'all 250ms ease-in-out',
          position: 'relative',
        },
        
        // Input base
        '.input': {
          display: 'block',
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.sm'),
          lineHeight: theme('lineHeight.5'),
          color: theme('colors.secondary.900'),
          backgroundColor: theme('colors.white'),
          border: `1px solid ${theme('colors.secondary.300')}`,
          borderRadius: theme('borderRadius.md'),
          transition: 'all 150ms ease-in-out',
          
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}1a`,
          },
          
          '&::placeholder': {
            color: theme('colors.secondary.400'),
          },
        },
      };
      
      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],

  // ===============================================
  // CONFIGURACIONES ADICIONALES
  // ===============================================
  
  // Configuración de dark mode (preparado para futuro)
  darkMode: 'class',
  
  // Configuración para development vs production
  future: {
    hoverOnlyWhenSupported: true,
  },
  
  // Experimental features (removido ya que no es necesario para Tailwind 3.4+)
  // experimental: {
  //   optimizeUniversalDefaults: true,
  // },
} satisfies Config;

export default config;