// ===============================================
// FUNCIONES DE FORMATEO
// ===============================================

import { format, parseISO, formatDistanceToNow, isValid, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

// ===============================================
// FORMATEO DE FECHAS
// ===============================================

/**
 * Formatea una fecha para mostrar en la UI
 */
export function formatDate(date: string | Date | null | undefined, pattern: string = 'dd/MM/yyyy'): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, pattern, { locale: es });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return '';
  }
}

/**
 * Formatea una fecha con hora
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

/**
 * Formatea una fecha para el input de tipo date
 */
export function formatDateForInput(date: string | Date | null | undefined): string {
  return formatDate(date, 'yyyy-MM-dd');
}

/**
 * Formatea una fecha de manera relativa (hace 2 días, en 1 hora, etc.)
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return formatDistanceToNow(dateObj, { 
      addSuffix: true, 
      locale: es 
    });
  } catch (error) {
    console.warn('Error formatting relative time:', error);
    return '';
  }
}

/**
 * Formatea un rango de fechas
 */
export function formatDateRange(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  separator: string = ' - '
): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (!start && !end) return '';
  if (!start) return `Hasta ${end}`;
  if (!end) return `Desde ${start}`;
  
  return `${start}${separator}${end}`;
}

/**
 * Obtiene el nombre del día de la semana
 */
export function getDayName(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'EEEE', { locale: es });
  } catch (error) {
    console.warn('Error getting day name:', error);
    return '';
  }
}

/**
 * Obtiene el nombre del mes
 */
export function getMonthName(date: string | Date | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'MMMM', { locale: es });
  } catch (error) {
    console.warn('Error getting month name:', error);
    return '';
  }
}

// ===============================================
// FORMATEO DE NÚMEROS
// ===============================================

/**
 * Formatea un número como moneda
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: string = 'USD',
  locale: string = 'es-EC'
): string {
  if (amount === null || amount === undefined || amount === '') return '';
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    console.warn('Error formatting currency:', error);
    return numericAmount.toString();
  }
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(
  number: number | string | null | undefined,
  locale: string = 'es-EC'
): string {
  if (number === null || number === undefined || number === '') return '';
  
  const numericValue = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(numericValue)) return '';
  
  try {
    return new Intl.NumberFormat(locale).format(numericValue);
  } catch (error) {
    console.warn('Error formatting number:', error);
    return numericValue.toString();
  }
}

/**
 * Formatea un porcentaje
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals: number = 1,
  locale: string = 'es-EC'
): string {
  if (value === null || value === undefined || value === '') return '';
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numericValue / 100);
  } catch (error) {
    console.warn('Error formatting percentage:', error);
    return `${numericValue}%`;
  }
}

/**
 * Formatea un número con unidades abreviadas (1K, 1M, etc.)
 */
export function formatCompactNumber(
  number: number | string | null | undefined,
  locale: string = 'es-EC'
): string {
  if (number === null || number === undefined || number === '') return '';
  
  const numericValue = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(numericValue)) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(numericValue);
  } catch (error) {
    console.warn('Error formatting compact number:', error);
    return numericValue.toString();
  }
}

// ===============================================
// FORMATEO DE TEXTO
// ===============================================

/**
 * Capitaliza la primera letra de cada palabra
 */
export function toTitleCase(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Capitaliza solo la primera letra
 */
export function capitalize(text: string | null | undefined): string {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convierte texto a mayúsculas
 */
export function toUpperCase(text: string | null | undefined): string {
  if (!text) return '';
  return text.toUpperCase();
}

/**
 * Convierte texto a minúsculas
 */
export function toLowerCase(text: string | null | undefined): string {
  if (!text) return '';
  return text.toLowerCase();
}

/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Remueve acentos y caracteres especiales
 */
export function removeAccents(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '');
}

/**
 * Genera un slug a partir de un texto
 */
export function generateSlug(text: string | null | undefined): string {
  if (!text) return '';
  
  return removeAccents(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Oculta parcialmente un email
 */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return '';
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const visibleChars = Math.min(3, Math.floor(username.length / 2));
  const maskedUsername = username.slice(0, visibleChars) + '*'.repeat(username.length - visibleChars);
  
  return `${maskedUsername}@${domain}`;
}

/**
 * Oculta parcialmente un número de teléfono
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 4) return phone;
  
  const visibleStart = cleanPhone.slice(0, 2);
  const visibleEnd = cleanPhone.slice(-2);
  const maskedMiddle = '*'.repeat(cleanPhone.length - 4);
  
  return `${visibleStart}${maskedMiddle}${visibleEnd}`;
}

/**
 * Oculta parcialmente un documento de identidad
 */
export function maskDocument(document: string | null | undefined): string {
  if (!document) return '';
  
  if (document.length <= 4) return document;
  
  const visibleStart = document.slice(0, 2);
  const visibleEnd = document.slice(-2);
  const maskedMiddle = '*'.repeat(document.length - 4);
  
  return `${visibleStart}${maskedMiddle}${visibleEnd}`;
}

// ===============================================
// FORMATEO DE NOMBRES
// ===============================================

/**
 * Formatea el nombre completo
 */
export function formatFullName(
  nombres: string | null | undefined,
  apellidos: string | null | undefined
): string {
  const formattedNombres = nombres ? toTitleCase(nombres.trim()) : '';
  const formattedApellidos = apellidos ? toTitleCase(apellidos.trim()) : '';
  
  return `${formattedNombres} ${formattedApellidos}`.trim();
}

/**
 * Obtiene las iniciales de un nombre
 */
export function getInitials(
  nombres: string | null | undefined,
  apellidos: string | null | undefined
): string {
  const nombresInitial = nombres ? nombres.trim().charAt(0).toUpperCase() : '';
  const apellidosInitial = apellidos ? apellidos.trim().charAt(0).toUpperCase() : '';
  
  return `${nombresInitial}${apellidosInitial}`;
}

/**
 * Formatea el nombre de manera corta (Primer nombre + Primer apellido)
 */
export function formatShortName(
  nombres: string | null | undefined,
  apellidos: string | null | undefined
): string {
  const primerNombre = nombres ? nombres.trim().split(' ')[0] : '';
  const primerApellido = apellidos ? apellidos.trim().split(' ')[0] : '';
  
  return formatFullName(primerNombre, primerApellido);
}

// ===============================================
// FORMATEO DE DIRECCIONES
// ===============================================

/**
 * Formatea una dirección completa
 */
export function formatAddress(address: {
  provincia?: string;
  canton?: string;
  parroquia?: string;
  sector?: string;
  calles?: string;
  numeracion?: string;
  referencia?: string;
}): string {
  const parts = [
    address.calles,
    address.numeracion,
    address.sector,
    address.parroquia,
    address.canton,
    address.provincia,
  ].filter(Boolean);
  
  return parts.join(', ');
}

// ===============================================
// FORMATEO DE HORARIOS
// ===============================================

/**
 * Formatea un horario
 */
export function formatSchedule(
  dia: string | null | undefined,
  horaInicio: string | null | undefined,
  horaFin: string | null | undefined
): string {
  if (!dia || !horaInicio || !horaFin) return '';
  
  const diaFormatted = capitalize(dia);
  
  return `${diaFormatted} de ${horaInicio} a ${horaFin}`;
}

/**
 * Formatea una hora (24h a 12h)
 */
export function formatTime12Hour(time: string | null | undefined): string {
  if (!time) return '';
  
  try {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.warn('Error formatting time:', error);
    return time;
  }
}

// ===============================================
// FORMATEO DE TAMAÑOS DE ARCHIVO
// ===============================================

/**
 * Formatea el tamaño de un archivo
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, index);
  
  return `${size.toFixed(1)} ${units[index]}`;
}

// ===============================================
// FORMATEO DE ESTADOS
// ===============================================

/**
 * Formatea un estado con color
 */
export function formatStatus(
  status: string | null | undefined,
  statusConfig: Record<string, { label: string; color: string }>
): { label: string; color: string } {
  if (!status || !statusConfig[status]) {
    return { label: status || 'Desconocido', color: 'neutral' };
  }
  
  return statusConfig[status];
}

// ===============================================
// UTILIDADES DE VALIDACIÓN DE FORMATO
// ===============================================

/**
 * Valida si un string es una fecha válida
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
}

/**
 * Valida si un string es un número válido
 */
export function isValidNumber(value: string | number): boolean {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return !isNaN(parseFloat(value));
  return false;
}

/**
 * Valida si un string es un email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}