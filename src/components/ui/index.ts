// ===============================================
// ÍNDICE DE COMPONENTES UI - Sistema de Catequesis
// ===============================================

// Componentes base fundamentales
export { Button } from './Button';
export { Input } from './Input';
export { Card, CardHeader, CardBody, CardFooter, SimpleCard, StatsCard } from './Card';
export { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmModal } from './Modal';
export { Table } from './Table';
export { Select } from './Select';

// Componentes de feedback y estado
export { 
  Loading, 
  PageLoading, 
  ButtonLoading, 
  TableLoading, 
  CardLoading 
} from './Loading';

export { 
  Alert, 
  Toast, 
  InlineAlert, 
  BannerAlert 
} from './Alert';

// Componentes de presentación
export { 
  Badge, 
  StatusBadge, 
  RoleBadge, 
  CountBadge, 
  NivelBadge 
} from './Badge';

export { 
  Avatar, 
  AvatarGroup, 
  CatequistaAvatar 
} from './Avatar';

export { 
  Tooltip, 
  SimpleTooltip, 
  InfoTooltip 
} from './Tooltip';

// Re-exportar tipos desde el archivo de tipos central
export type { 
  ButtonProps,
  InputProps,
  CardProps,
  ModalProps,
  SelectProps,
  SelectOption,
  LoadingProps,
  AlertProps,
  BadgeProps,
  AvatarProps,
  AvatarGroupProps,
  TooltipProps,
  TableProps,
  TableColumn
} from '@/lib/types/ui';