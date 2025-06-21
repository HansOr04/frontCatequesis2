// ===============================================
// TIPOS DE INTERFAZ DE USUARIO
// ===============================================

import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

/**
 * Tamaños estándar de componentes
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Variantes de color para componentes
 */
export type ColorVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'neutral';

/**
 * Variantes de estilo para botones
 */
export type ButtonVariant = 
  | 'solid' 
  | 'outline' 
  | 'ghost' 
  | 'link' 
  | 'soft';

/**
 * Posiciones para elementos flotantes
 */
export type Position = 
  | 'top' 
  | 'top-start' 
  | 'top-end'
  | 'bottom' 
  | 'bottom-start' 
  | 'bottom-end'
  | 'left' 
  | 'left-start' 
  | 'left-end'
  | 'right' 
  | 'right-start' 
  | 'right-end';

/**
 * Estados de carga
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ===============================================
// COMPONENTES BASE
// ===============================================

/**
 * Props base para componentes
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

/**
 * Props para Button
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  variant?: ButtonVariant;
  color?: ColorVariant;
  size?: Size;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  loadingText?: string;
}

/**
 * Props para Input
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseComponentProps {
  label?: string;
  error?: string;
  helper?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  variant?: 'outline' | 'filled' | 'underlined';
}

/**
 * Props para Select
 */
export interface SelectOption {
  value: string | number;
  label: string;
  isDisabled?: boolean;
  description?: string;
  icon?: ReactNode;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  label?: string;
  error?: string;
  helper?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isClearable?: boolean;
  size?: Size;
  onChange?: (value: string | number | string[] | number[]) => void;
  onSearch?: (query: string) => void;
}

/**
 * Props para Card
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseComponentProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: Size;
  header?: ReactNode;
  footer?: ReactNode;
  isHoverable?: boolean;
  isClickable?: boolean;
}

/**
 * Props para Modal
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: Size | 'full';
  placement?: 'center' | 'top';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  preventScroll?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  onOpenComplete?: () => void;
  onCloseComplete?: () => void;
}

/**
 * Props para Table
 */
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  sorter?: (a: T, b: T) => number;
}

export interface TableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  empty?: ReactNode;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    onChange: (page: number, pageSize: number) => void;
  };
  selection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
    type?: 'checkbox' | 'radio';
  };
  onRow?: (record: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  scroll?: {
    x?: string | number;
    y?: string | number;
  };
}

// ===============================================
// NAVEGACIÓN Y LAYOUT
// ===============================================

/**
 * Item de navegación
 */
export interface NavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  children?: NavItem[];
  isDisabled?: boolean;
  badge?: string | number;
  permissions?: string[];
}

/**
 * Props para Sidebar
 */
export interface SidebarProps extends BaseComponentProps {
  items: NavItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  currentPath?: string;
  logo?: ReactNode;
  footer?: ReactNode;
}

/**
 * Props para Navbar
 */
export interface NavbarProps extends BaseComponentProps {
  title?: string;
  logo?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    role: string;
  };
  onMenuToggle?: () => void;
  showMenuToggle?: boolean;
}

/**
 * Item de breadcrumb
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  isCurrentPage?: boolean;
}

// ===============================================
// FORMULARIOS
// ===============================================

/**
 * Estado de validación de campo
 */
export interface FieldState {
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
  isValid: boolean;
}

/**
 * Configuración de campo de formulario
 */
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  label?: string;
  placeholder?: string;
  helper?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    email?: boolean;
    url?: boolean;
    custom?: (value: any) => string | null;
  };
  options?: SelectOption[];
  defaultValue?: any;
  dependencies?: string[];
  conditional?: (values: Record<string, any>) => boolean;
}

/**
 * Props para FormBuilder
 */
export interface FormBuilderProps extends BaseComponentProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal' | 'inline';
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

// ===============================================
// NOTIFICACIONES Y FEEDBACK
// ===============================================

/**
 * Tipos de toast
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Configuración de toast
 */
export interface ToastConfig {
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  isClosable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Props para Alert
 */
export interface AlertProps extends BaseComponentProps {
  type: ToastType;
  title?: string;
  description?: string;
  isClosable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  action?: ReactNode;
}

/**
 * Props para Loading
 */
export interface LoadingProps extends BaseComponentProps {
  size?: Size;
  color?: ColorVariant;
  text?: string;
  overlay?: boolean;
  fullScreen?: boolean;
}

// ===============================================
// DATOS Y VISUALIZACIÓN
// ===============================================

/**
 * Props para StatsCard
 */
export interface StatsCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  color?: ColorVariant;
  isLoading?: boolean;
  onClick?: () => void;
}

/**
 * Configuración de gráfico
 */
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: any[];
  xAxis?: string;
  yAxis?: string | string[];
  colors?: string[];
  title?: string;
  subtitle?: string;
  legend?: boolean;
  grid?: boolean;
  responsive?: boolean;
  height?: number;
}

/**
 * Props para Chart
 */
export interface ChartProps extends BaseComponentProps {
  config: ChartConfig;
  loading?: boolean;
  error?: string;
  onDataPointClick?: (data: any) => void;
}

// ===============================================
// UTILIDADES
// ===============================================

/**
 * Props para Tooltip
 */
export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  placement?: Position;
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  offset?: number;
  arrow?: boolean;
  isDisabled?: boolean;
}

/**
 * Props para Badge
 */
export interface BadgeProps extends BaseComponentProps {
  variant?: 'solid' | 'outline' | 'soft';
  color?: ColorVariant;
  size?: Size;
  shape?: 'rounded' | 'square';
  dot?: boolean;
  count?: number;
  showZero?: boolean;
  max?: number;
}

/**
 * Props para Pagination
 */
export interface PaginationProps extends BaseComponentProps {
  current: number;
  total: number;
  pageSize: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  disabled?: boolean;
  size?: Size;
  onChange: (page: number, pageSize: number) => void;
}

/**
 * Estado global de UI
 */
export interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: ToastConfig[];
  modals: {
    [key: string]: {
      isOpen: boolean;
      props?: any;
    };
  };
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
}

/**
 * Acciones de UI
 */
export type UIAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: ToastConfig }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'OPEN_MODAL'; payload: { key: string; props?: any } }
  | { type: 'CLOSE_MODAL'; payload: string }
  | { type: 'SET_LOADING'; payload: { key: string; loading: boolean } }
  | { type: 'SET_GLOBAL_LOADING'; payload: boolean };