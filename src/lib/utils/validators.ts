// ===============================================
// FUNCIONES DE VALIDACIÓN
// ===============================================

import { VALIDATION_CONFIG } from './constants';

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Tipo de función de validación
 */
export type Validator = (value: any, allValues?: Record<string, any>) => ValidationResult;

// ===============================================
// VALIDACIONES BÁSICAS
// ===============================================

/**
 * Valida que un campo sea requerido
 */
export function required(message: string = 'Este campo es requerido'): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    const isEmpty = value === null || 
                   value === undefined || 
                   value === '' || 
                   (Array.isArray(value) && value.length === 0) ||
                   (typeof value === 'string' && value.trim() === '');
    
    return {
      isValid: !isEmpty,
      message: isEmpty ? message : undefined,
    };
  };
}

/**
 * Valida longitud mínima
 */
export function minLength(min: number, message?: string): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true }; // No validar si está vacío
    
    const length = typeof value === 'string' ? value.length : 0;
    const isValid = length >= min;
    
    return {
      isValid,
      message: !isValid ? (message || `Mínimo ${min} caracteres`) : undefined,
    };
  };
}

/**
 * Valida longitud máxima
 */
export function maxLength(max: number, message?: string): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true }; // No validar si está vacío
    
    const length = typeof value === 'string' ? value.length : 0;
    const isValid = length <= max;
    
    return {
      isValid,
      message: !isValid ? (message || `Máximo ${max} caracteres`) : undefined,
    };
  };
}

/**
 * Valida valor mínimo numérico
 */
export function min(minValue: number, message?: string): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true }; // No validar si está vacío
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const isValid = !isNaN(numValue) && numValue >= minValue;
    
    return {
      isValid,
      message: !isValid ? (message || `Valor mínimo: ${minValue}`) : undefined,
    };
  };
}

/**
 * Valida valor máximo numérico
 */
export function max(maxValue: number, message?: string): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true }; // No validar si está vacío
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const isValid = !isNaN(numValue) && numValue <= maxValue;
    
    return {
      isValid,
      message: !isValid ? (message || `Valor máximo: ${maxValue}`) : undefined,
    };
  };
}

/**
 * Valida patrón de expresión regular
 */
export function pattern(regex: RegExp, message: string = 'Formato inválido'): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true }; // No validar si está vacío
    
    const isValid = regex.test(String(value));
    
    return {
      isValid,
      message: !isValid ? message : undefined,
    };
  };
}

// ===============================================
// VALIDACIONES ESPECÍFICAS
// ===============================================

/**
 * Valida formato de email
 */
export function email(message: string = 'Formato de email inválido'): Validator {
  return pattern(VALIDATION_CONFIG.email.pattern, message);
}

/**
 * Valida formato de teléfono
 */
export function phone(message: string = 'Formato de teléfono inválido'): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true };
    
    const phoneStr = String(value).replace(/\s/g, '');
    const isValid = VALIDATION_CONFIG.telefono.pattern.test(phoneStr) &&
                   phoneStr.length >= VALIDATION_CONFIG.telefono.minLength &&
                   phoneStr.length <= VALIDATION_CONFIG.telefono.maxLength;
    
    return {
      isValid,
      message: !isValid ? message : undefined,
    };
  };
}

/**
 * Valida formato de username
 */
export function username(message: string = 'Username inválido (solo letras, números, puntos, guiones)'): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true };
    
    const result = pattern(VALIDATION_CONFIG.username.pattern, message)(value, allValues);
    if (!result.isValid) return result;
    
    // Validar longitud
    const lengthResult = [
      minLength(VALIDATION_CONFIG.username.minLength),
      maxLength(VALIDATION_CONFIG.username.maxLength)
    ].map(validator => validator(value, allValues)).find(r => !r.isValid);
    
    return lengthResult || { isValid: true };
  };
}

/**
 * Valida fortaleza de contraseña
 */
export function password(message?: string): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true };
    
    const password = String(value);
    const errors: string[] = [];
    
    if (password.length < VALIDATION_CONFIG.password.minLength) {
      errors.push(`Mínimo ${VALIDATION_CONFIG.password.minLength} caracteres`);
    }
    
    if (password.length > VALIDATION_CONFIG.password.maxLength) {
      errors.push(`Máximo ${VALIDATION_CONFIG.password.maxLength} caracteres`);
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('al menos una minúscula');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('al menos una mayúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('al menos un número');
    }
    
    const isValid = errors.length === 0;
    const defaultMessage = errors.length > 0 
      ? `La contraseña debe tener: ${errors.join(', ')}`
      : undefined;
    
    return {
      isValid,
      message: !isValid ? (message || defaultMessage) : undefined,
    };
  };
}

/**
 * Valida cédula ecuatoriana
 */
export function cedulaEcuador(message: string = 'Cédula ecuatoriana inválida'): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true };
    
    const cedula = String(value).replace(/\D/g, '');
    
    // Debe tener exactamente 10 dígitos
    if (cedula.length !== 10) {
      return { isValid: false, message };
    }
    
    // Validar provincia (primeros 2 dígitos)
    const provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) {
      return { isValid: false, message };
    }
    
    // Validar dígito verificador
    const digits = cedula.split('').map(Number);
    const verificador = digits.pop()!;
    
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let digit = digits[i];
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      suma += digit;
    }
    
    const digitoVerificador = (10 - (suma % 10)) % 10;
    const isValid = digitoVerificador === verificador;
    
    return {
      isValid,
      message: !isValid ? message : undefined,
    };
  };
}

/**
 * Valida RUC ecuatoriano
 */
export function rucEcuador(message: string = 'RUC ecuatoriano inválido'): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true };
    
    const ruc = String(value).replace(/\D/g, '');
    
    // Debe tener exactamente 13 dígitos
    if (ruc.length !== 13) {
      return { isValid: false, message };
    }
    
    // Validar que termine en 001
    if (!ruc.endsWith('001')) {
      return { isValid: false, message };
    }
    
    // Validar cédula base (primeros 10 dígitos)
    const cedulaBase = ruc.substring(0, 10);
    const cedulaValidator = cedulaEcuador();
    const cedulaValidation = cedulaValidator(cedulaBase, allValues);
    
    return {
      isValid: cedulaValidation.isValid,
      message: !cedulaValidation.isValid ? message : undefined,
    };
  };
}

/**
 * Valida fecha
 */
export function date(message: string = 'Fecha inválida'): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true };
    
    const date = new Date(value);
    const isValid = !isNaN(date.getTime());
    
    return {
      isValid,
      message: !isValid ? message : undefined,
    };
  };
}

/**
 * Valida fecha mínima
 */
export function minDate(minDate: Date | string, message?: string): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true };
    
    const inputDate = new Date(value);
    const limitDate = new Date(minDate);
    
    if (isNaN(inputDate.getTime()) || isNaN(limitDate.getTime())) {
      return { isValid: false, message: 'Fecha inválida' };
    }
    
    const isValid = inputDate >= limitDate;
    
    return {
      isValid,
      message: !isValid ? (message || `Fecha debe ser posterior a ${limitDate.toLocaleDateString()}`) : undefined,
    };
  };
}

/**
 * Valida fecha máxima
 */
export function maxDate(maxDate: Date | string, message?: string): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value) return { isValid: true };
    
    const inputDate = new Date(value);
    const limitDate = new Date(maxDate);
    
    if (isNaN(inputDate.getTime()) || isNaN(limitDate.getTime())) {
      return { isValid: false, message: 'Fecha inválida' };
    }
    
    const isValid = inputDate <= limitDate;
    
    return {
      isValid,
      message: !isValid ? (message || `Fecha debe ser anterior a ${limitDate.toLocaleDateString()}`) : undefined,
    };
  };
}

/**
 * Valida edad mínima
 */
export function minAge(minAge: number, message?: string): Validator {
  return (value: any): ValidationResult => {
    if (!value) return { isValid: true };
    
    const birthDate = new Date(value);
    if (isNaN(birthDate.getTime())) {
      return { isValid: false, message: 'Fecha de nacimiento inválida' };
    }
    
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
    
    const isValid = actualAge >= minAge;
    
    return {
      isValid,
      message: !isValid ? (message || `Edad mínima requerida: ${minAge} años`) : undefined,
    };
  };
}

/**
 * Valida que dos campos coincidan
 */
export function matches(otherField: string, message?: string): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (!value || !allValues) return { isValid: true };
    
    const isValid = value === allValues[otherField];
    
    return {
      isValid,
      message: !isValid ? (message || 'Los campos no coinciden') : undefined,
    };
  };
}

/**
 * Valida formato de URL
 */
export function url(message: string = 'URL inválida'): Validator {
  return (value: any): ValidationResult => {
    if (!value) return { isValid: true };
    
    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return { isValid: false, message };
    }
  };
}

/**
 * Valida archivo
 */
export function file(options: {
  maxSize?: number;
  allowedTypes?: string[];
  message?: string;
}): Validator {
  return (value: any): ValidationResult => {
    if (!value) return { isValid: true };
    
    if (!(value instanceof File)) {
      return { isValid: false, message: 'Debe ser un archivo válido' };
    }
    
    const file = value as File;
    
    // Validar tamaño
    if (options.maxSize && file.size > options.maxSize) {
      return {
        isValid: false,
        message: `El archivo es demasiado grande. Máximo: ${Math.round(options.maxSize / 1024 / 1024)}MB`,
      };
    }
    
    // Validar tipo
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: `Tipo de archivo no permitido. Permitidos: ${options.allowedTypes.join(', ')}`,
      };
    }
    
    return { isValid: true };
  };
}

// ===============================================
// COMPOSICIÓN DE VALIDADORES
// ===============================================

/**
 * Combina múltiples validadores
 */
export function compose(...validators: Validator[]): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value, allValues);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
}

/**
 * Validación condicional
 */
export function when(
  condition: (value: any, allValues?: Record<string, any>) => boolean,
  validator: Validator
): Validator {
  return (value: any, allValues?: Record<string, any>): ValidationResult => {
    if (condition(value, allValues)) {
      return validator(value, allValues);
    }
    return { isValid: true };
  };
}

// ===============================================
// VALIDADORES PREDEFINIDOS PARA EL SISTEMA
// ===============================================

/**
 * Validador para nombres
 */
export const validateNombres = compose(
  required('El nombre es requerido'),
  minLength(VALIDATION_CONFIG.nombres.minLength, 'Nombre muy corto'),
  maxLength(VALIDATION_CONFIG.nombres.maxLength, 'Nombre muy largo'),
  pattern(VALIDATION_CONFIG.nombres.pattern, 'Solo se permiten letras y espacios')
);

/**
 * Validador para apellidos
 */
export const validateApellidos = compose(
  required('El apellido es requerido'),
  minLength(VALIDATION_CONFIG.nombres.minLength, 'Apellido muy corto'),
  maxLength(VALIDATION_CONFIG.nombres.maxLength, 'Apellido muy largo'),
  pattern(VALIDATION_CONFIG.nombres.pattern, 'Solo se permiten letras y espacios')
);

/**
 * Validador para documento de identidad
 */
export const validateDocumento = compose(
  required('El documento es requerido'),
  minLength(VALIDATION_CONFIG.documento.minLength, 'Documento muy corto'),
  maxLength(VALIDATION_CONFIG.documento.maxLength, 'Documento muy largo'),
  pattern(VALIDATION_CONFIG.documento.pattern, 'Formato de documento inválido')
);

/**
 * Validador para email
 */
export const validateEmail = compose(
  required('El email es requerido'),
  email()
);

/**
 * Validador para teléfono
 */
export const validateTelefono = compose(
  required('El teléfono es requerido'),
  phone()
);

/**
 * Validador para username
 */
export const validateUsername = compose(
  required('El usuario es requerido'),
  username()
);

/**
 * Validador para contraseña
 */
export const validatePassword = compose(
  required('La contraseña es requerida'),
  password()
);

/**
 * Validador para confirmar contraseña
 */
export const validateConfirmPassword = compose(
  required('Confirme la contraseña'),
  matches('password', 'Las contraseñas no coinciden')
);

/**
 * Validador para fecha de nacimiento
 */
export const validateFechaNacimiento = compose(
  required('La fecha de nacimiento es requerida'),
  date(),
  maxDate(new Date(), 'La fecha no puede ser futura'),
  minAge(0, 'Fecha de nacimiento inválida')
);

// ===============================================
// UTILIDADES DE VALIDACIÓN
// ===============================================

/**
 * Valida un objeto completo usando un esquema de validación
 */
export function validateObject(
  data: Record<string, any>,
  schema: Record<string, Validator>
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field], data);
    if (!result.isValid && result.message) {
      errors[field] = result.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida un array de objetos
 */
export function validateArray<T>(
  items: T[],
  validator: (item: T, index: number, allItems: T[]) => ValidationResult
): { isValid: boolean; errors: Array<{ index: number; message: string }> } {
  const errors: Array<{ index: number; message: string }> = [];
  
  items.forEach((item, index) => {
    const result = validator(item, index, items);
    if (!result.isValid && result.message) {
      errors.push({ index, message: result.message });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}