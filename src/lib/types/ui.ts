// ===============================================
// TIPOS DE INTERFAZ DE USUARIO - ACTUALIZADOS
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
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseComponentProps {
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
  size?: Size;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
}

/**
 * Props para Select
 */
export interface SelectOption {
  value: string | number;
  label: string;
  isDisabled?: boolean;
  disabled?: boolean; // Alias para retrocompatibilidad
  description?: string;
  icon?: ReactNode;
  searchableText?: string;
}

export interface SelectProps extends BaseComponentProps {
  options?: SelectOption[];
  value?: string | number | string[] | number[];
  defaultValue?: string | number | string[] | number[];
  placeholder?: string;
  label?: string;
  error?: string;
  helper?: string;
  multiple?: boolean;
  isMulti?: boolean; // Alias para retrocompatibilidad
  searchable?: boolean;
  isSearchable?: boolean; // Alias para retrocompatibilidad
  clearable?: boolean;
  isClearable?: boolean; // Alias para retrocompatibilidad
  loading?: boolean;
  isLoading?: boolean; // Alias para retrocompatibilidad
  disabled?: boolean;
  isDisabled?: boolean; // Alias para retrocompatibilidad
  isRequired?: boolean;
  size?: Size;
  fullWidth?: boolean;
  renderOption?: (option: SelectOption) => ReactNode;
  renderValue?: (option: SelectOption) => ReactNode;
  maxHeight?: number;
  onChange?: (value: any, option?: SelectOption | SelectOption[]) => void;
  onSearch?: (query: string) => void;
}

/**
 * Props para Card
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseComponentProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: Size | 'none';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  header?: ReactNode;
  footer?: ReactNode;
  title?: string;
  subtitle?: string;
  extra?: ReactNode;
  hoverable?: boolean;
  isHoverable?: boolean; // Alias para retrocompatibilidad
  clickable?: boolean;
  isClickable?: boolean; // Alias para retrocompatibilidad
  fullWidth?: boolean;
  fullHeight?: boolean;
  loading?: boolean;
}

/**
 * Props para Modal
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  size?: Size | 'full' | '2xl' | '3xl' | '4xl' | '5xl';
  placement?: 'center' | 'top';
  centered?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  closeOnEsc?: boolean; // Alias para retrocompatibilidad
  showCloseButton?: boolean;
  preventScroll?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  overlayClassName?: string;
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
 * Tipos de toast/alert
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

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
  type?: ToastType;
  title?: string;
  description?: string;
  showIcon?: boolean;
  closable?: boolean;
  isClosable?: boolean; // Alias para retrocompatibilidad
  onClose?: () => void;
  icon?: ReactNode;
  action?: ReactNode;
  actions?: ReactNode;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

/**
 * Props para Loading
 */
export interface LoadingProps extends BaseComponentProps {
  size?: Size;
  variant?: 'circular' | 'dots' | 'bars' | 'pulse' | 'church';
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
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  delay?: number;
  hideDelay?: number;
  offset?: number;
  arrow?: boolean;
  isDisabled?: boolean;
  disabled?: boolean; // Alias para retrocompatibilidad
  maxWidth?: number;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

/**
 * Props para Badge
 */
export interface BadgeProps extends BaseComponentProps {
  variant?: 'solid' | 'outline' | 'soft' | 'dot';
  color?: ColorVariant;
  size?: Size;
  shape?: 'rounded' | 'square';
  dot?: boolean;
  count?: number;
  showZero?: boolean;
  max?: number;
  pulse?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

/**
 * Props para Avatar
 */
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: Size | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  fallback?: ReactNode;
  showBorder?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
  badge?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

/**
 * Props para AvatarGroup
 */
export interface AvatarGroupProps extends BaseComponentProps {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
  spacing?: 'tight' | 'normal' | 'loose';
  size?: AvatarProps['size'];
  showTooltip?: boolean;
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