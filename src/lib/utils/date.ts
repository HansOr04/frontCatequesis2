// ===============================================
// UTILIDADES DE FECHA
// ===============================================

import {
  format,
  parseISO,
  isValid,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameYear,
  isWeekend,
  getDay,
  getMonth,
  getYear,
  setDay,
  setMonth,
  setYear,
} from 'date-fns';
import { es } from 'date-fns/locale';

// ===============================================
// CONSTANTES DE FECHA
// ===============================================

export const DATE_FORMATS = {
  // Formatos de visualización
  DISPLAY_SHORT: 'dd/MM/yyyy',
  DISPLAY_LONG: 'EEEE, dd \'de\' MMMM \'de\' yyyy',
  DISPLAY_MEDIUM: 'dd MMM yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  DISPLAY_TIME_ONLY: 'HH:mm',
  DISPLAY_TIME_12H: 'hh:mm a',

  // Formatos de API
  API_DATE: 'yyyy-MM-dd',
  API_DATETIME: 'yyyy-MM-dd HH:mm:ss',
  API_TIME: 'HH:mm:ss',

  // Formatos de input
  INPUT_DATE: 'yyyy-MM-dd',
  INPUT_TIME: 'HH:mm',
  INPUT_DATETIME: 'yyyy-MM-dd\'T\'HH:mm',

  // Formatos ISO
  ISO_DATE: 'yyyy-MM-dd',
  ISO_DATETIME: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
} as const;

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
] as const;

export const MONTHS = [
  { value: 0, label: 'Enero', short: 'Ene' },
  { value: 1, label: 'Febrero', short: 'Feb' },
  { value: 2, label: 'Marzo', short: 'Mar' },
  { value: 3, label: 'Abril', short: 'Abr' },
  { value: 4, label: 'Mayo', short: 'May' },
  { value: 5, label: 'Junio', short: 'Jun' },
  { value: 6, label: 'Julio', short: 'Jul' },
  { value: 7, label: 'Agosto', short: 'Ago' },
  { value: 8, label: 'Septiembre', short: 'Sep' },
  { value: 9, label: 'Octubre', short: 'Oct' },
  { value: 10, label: 'Noviembre', short: 'Nov' },
  { value: 11, label: 'Diciembre', short: 'Dic' },
] as const;

// ===============================================
// UTILIDADES DE PARSING
// ===============================================

/**
 * Convierte un string o Date a objeto Date
 */
export function parseDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  
  try {
    if (date instanceof Date) {
      return isValid(date) ? date : null;
    }
    
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    console.warn('Error parsing date:', error);
    return null;
  }
}

/**
 * Convierte una fecha a string en formato ISO
 */
export function toISOString(date: string | Date | null | undefined): string | null {
  const parsed = parseDate(date);
  return parsed ? parsed.toISOString() : null;
}

/**
 * Convierte una fecha a string en formato específico
 */
export function formatDateString(
  date: string | Date | null | undefined,
  formatStr: string = DATE_FORMATS.DISPLAY_SHORT
): string {
  const parsed = parseDate(date);
  if (!parsed) return '';
  
  try {
    return format(parsed, formatStr, { locale: es });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return '';
  }
}

// ===============================================
// UTILIDADES DE FECHA ACTUAL
// ===============================================

/**
 * Obtiene la fecha actual
 */
export function now(): Date {
  return new Date();
}

/**
 * Obtiene la fecha actual en formato ISO
 */
export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * Obtiene la fecha actual en formato de API
 */
export function nowAPI(): string {
  return formatDateString(now(), DATE_FORMATS.API_DATE);
}

/**
 * Obtiene la fecha y hora actual en formato de API
 */
export function nowAPIDateTime(): string {
  return formatDateString(now(), DATE_FORMATS.API_DATETIME);
}

/**
 * Obtiene solo la fecha de hoy (sin hora)
 */
export function today(): Date {
  return startOfDay(new Date());
}

/**
 * Obtiene la fecha de ayer
 */
export function yesterday(): Date {
  return subDays(today(), 1);
}

/**
 * Obtiene la fecha de mañana
 */
export function tomorrow(): Date {
  return addDays(today(), 1);
}

// ===============================================
// UTILIDADES DE RANGOS
// ===============================================

/**
 * Obtiene el rango de la semana actual
 */
export function thisWeek(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }), // Lunes
    end: endOfWeek(now, { weekStartsOn: 1 }), // Domingo
  };
}

/**
 * Obtiene el rango del mes actual
 */
export function thisMonth(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

/**
 * Obtiene el rango del año actual
 */
export function thisYear(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: startOfYear(now),
    end: endOfYear(now),
  };
}

/**
 * Obtiene el rango de los últimos N días
 */
export function lastNDays(days: number): { start: Date; end: Date } {
  const end = today();
  const start = subDays(end, days - 1);
  return { start, end };
}

/**
 * Obtiene el rango de las últimas N semanas
 */
export function lastNWeeks(weeks: number): { start: Date; end: Date } {
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const start = startOfWeek(subWeeks(end, weeks - 1), { weekStartsOn: 1 });
  return { start, end };
}

/**
 * Obtiene el rango de los últimos N meses
 */
export function lastNMonths(months: number): { start: Date; end: Date } {
  const end = endOfMonth(new Date());
  const start = startOfMonth(subMonths(end, months - 1));
  return { start, end };
}

// ===============================================
// UTILIDADES DE CÁLCULO
// ===============================================

/**
 * Calcula la edad basada en la fecha de nacimiento
 */
export function calculateAge(birthDate: string | Date | null | undefined): number | null {
  const birth = parseDate(birthDate);
  if (!birth) return null;
  
  const today = new Date();
  let age = differenceInYears(today, birth);
  
  // Ajustar si el cumpleaños no ha pasado este año
  const birthThisYear = setYear(birth, getYear(today));
  if (isAfter(birthThisYear, today)) {
    age--;
  }
  
  return age;
}

/**
 * Calcula la diferencia en días entre dos fechas
 */
export function daysBetween(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined
): number | null {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (!start || !end) return null;
  
  return differenceInDays(end, start);
}

/**
 * Calcula la diferencia en meses entre dos fechas
 */
export function monthsBetween(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined
): number | null {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (!start || !end) return null;
  
  return differenceInMonths(end, start);
}

/**
 * Calcula la diferencia en años entre dos fechas
 */
export function yearsBetween(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined
): number | null {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (!start || !end) return null;
  
  return differenceInYears(end, start);
}

// ===============================================
// UTILIDADES DE COMPARACIÓN
// ===============================================

/**
 * Verifica si una fecha es anterior a otra
 */
export function isDateBefore(
  date1: string | Date | null | undefined,
  date2: string | Date | null | undefined
): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  
  if (!d1 || !d2) return false;
  
  return isBefore(d1, d2);
}

/**
 * Verifica si una fecha es posterior a otra
 */
export function isDateAfter(
  date1: string | Date | null | undefined,
  date2: string | Date | null | undefined
): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  
  if (!d1 || !d2) return false;
  
  return isAfter(d1, d2);
}

/**
 * Verifica si dos fechas son el mismo día
 */
export function isSameDayAs(
  date1: string | Date | null | undefined,
  date2: string | Date | null | undefined
): boolean {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  
  if (!d1 || !d2) return false;
  
  return isSameDay(d1, d2);
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(date: string | Date | null | undefined): boolean {
  return isSameDayAs(date, new Date());
}

/**
 * Verifica si una fecha es ayer
 */
export function isYesterday(date: string | Date | null | undefined): boolean {
  return isSameDayAs(date, yesterday());
}

/**
 * Verifica si una fecha es mañana
 */
export function isTomorrow(date: string | Date | null | undefined): boolean {
  return isSameDayAs(date, tomorrow());
}

/**
 * Verifica si una fecha está en el futuro
 */
export function isFuture(date: string | Date | null | undefined): boolean {
  return isDateAfter(date, new Date());
}

/**
 * Verifica si una fecha está en el pasado
 */
export function isPast(date: string | Date | null | undefined): boolean {
  return isDateBefore(date, new Date());
}

/**
 * Verifica si una fecha es un fin de semana
 */
export function isWeekendDay(date: string | Date | null | undefined): boolean {
  const parsed = parseDate(date);
  if (!parsed) return false;
  
  return isWeekend(parsed);
}

// ===============================================
// UTILIDADES DE MANIPULACIÓN
// ===============================================

/**
 * Agrega días a una fecha
 */
export function addDaysToDate(
  date: string | Date | null | undefined,
  days: number
): Date | null {
  const parsed = parseDate(date);
  if (!parsed) return null;
  
  return addDays(parsed, days);
}

/**
 * Agrega semanas a una fecha
 */
export function addWeeksToDate(
  date: string | Date | null | undefined,
  weeks: number
): Date | null {
  const parsed = parseDate(date);
  if (!parsed) return null;
  
  return addWeeks(parsed, weeks);
}

/**
 * Agrega meses a una fecha
 */
export function addMonthsToDate(
  date: string | Date | null | undefined,
  months: number
): Date | null {
  const parsed = parseDate(date);
  if (!parsed) return null;
  
  return addMonths(parsed, months);
}

/**
 * Agrega años a una fecha
 */
export function addYearsToDate(
  date: string | Date | null | undefined,
  years: number
): Date | null {
  const parsed = parseDate(date);
  if (!parsed) return null;
  
  return addYears(parsed, years);
}

/**
 * Resta días a una fecha
 */
export function subtractDaysFromDate(
  date: string | Date | null | undefined,
  days: number
): Date | null {
  const parsed = parseDate(date);
  if (!parsed) return null;
  
  return subDays(parsed, days);
}

// ===============================================
// UTILIDADES ESPECÍFICAS DEL SISTEMA
// ===============================================

/**
 * Obtiene el rango de fechas para el año catequístico
 * (típicamente marzo a noviembre)
 */
export function getCatechismYearRange(year?: number): { start: Date; end: Date } {
  const currentYear = year || getYear(new Date());
  
  // Año catequístico: marzo del año actual a noviembre del año actual
  const start = new Date(currentYear, 2, 1); // Marzo (mes 2)
  const end = new Date(currentYear, 10, 30); // Noviembre (mes 10)
  
  return { start, end };
}

/**
 * Verifica si una fecha está dentro del año catequístico actual
 */
export function isInCatechismYear(date: string | Date | null | undefined): boolean {
  const parsed = parseDate(date);
  if (!parsed) return false;
  
  const { start, end } = getCatechismYearRange();
  
  return !isBefore(parsed, start) && !isAfter(parsed, end);
}

/**
 * Obtiene todas las fechas de un día específico de la semana en un rango
 */
export function getDatesForWeekday(
  startDate: string | Date,
  endDate: string | Date,
  weekday: number // 0 = domingo, 1 = lunes, etc.
): Date[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (!start || !end) return [];
  
  const dates: Date[] = [];
  let current = setDay(start, weekday);
  
  // Si la fecha calculada es anterior al inicio, mover a la siguiente semana
  if (isBefore(current, start)) {
    current = addWeeks(current, 1);
  }
  
  while (!isAfter(current, end)) {
    dates.push(new Date(current));
    current = addWeeks(current, 1);
  }
  
  return dates;
}

/**
 * Obtiene el nombre del día de la semana
 */
export function getWeekdayName(
  date: string | Date | null | undefined,
  format: 'long' | 'short' = 'long'
): string {
  const parsed = parseDate(date);
  if (!parsed) return '';
  
  const dayIndex = getDay(parsed);
  const day = DAYS_OF_WEEK.find(d => d.value === dayIndex);
  
  return day ? (format === 'long' ? day.label : day.short) : '';
}

/**
 * Obtiene el nombre del mes
 */
export function getMonthName(
  date: string | Date | null | undefined,
  format: 'long' | 'short' = 'long'
): string {
  const parsed = parseDate(date);
  if (!parsed) return '';
  
  const monthIndex = getMonth(parsed);
  const month = MONTHS.find(m => m.value === monthIndex);
  
  return month ? (format === 'long' ? month.label : month.short) : '';
}

/**
 * Genera un array de fechas entre dos fechas
 */
export function getDateRange(
  startDate: string | Date,
  endDate: string | Date
): Date[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  
  if (!start || !end) return [];
  
  const dates: Date[] = [];
  let current = new Date(start);
  
  while (!isAfter(current, end)) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }
  
  return dates;
}

/**
 * Convierte una hora en formato string (HH:mm) a minutos
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convierte minutos a formato de hora (HH:mm)
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Valida si una cadena es una fecha válida
 */
export function isValidDateString(dateString: string): boolean {
  const parsed = parseDate(dateString);
  return parsed !== null;
}

/**
 * Obtiene el primer y último día del mes de una fecha
 */
export function getMonthBounds(date: string | Date | null | undefined): { start: Date; end: Date } | null {
  const parsed = parseDate(date);
  if (!parsed) return null;
  
  return {
    start: startOfMonth(parsed),
    end: endOfMonth(parsed),
  };
}