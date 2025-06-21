// ===============================================
// TIPOS DE MODELOS DEL SISTEMA
// ===============================================
export type UserRole = 'admin' | 'parroco' | 'secretaria' | 'catequista' | 'consulta';
/**
 * Estados generales
 */
export type EstadoGeneral = 'activo' | 'inactivo' | 'pendiente' | 'completado' | 'cancelado';

/**
 * Tipos de documento
 */
export type TipoDocumento = 'cedula' | 'pasaporte' | 'ruc' | 'documento_extranjero';

/**
 * Estados civiles
 */
export type EstadoCivil = 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'union_libre';

/**
 * Géneros
 */
export type Genero = 'masculino' | 'femenino' | 'otro' | 'no_especifica';

// ===============================================
// PARROQUIA
// ===============================================

export interface Parroquia {
  id: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  email?: string;
  parroco: string;
  vicario?: string;
  estado: EstadoGeneral;
  ubicacion?: {
    provincia: string;
    canton: string;
    parroquia: string;
    sector?: string;
    coordenadas?: {
      latitud: number;
      longitud: number;
    };
  };
  estadisticas?: {
    catequizandos: number;
    catequistas: number;
    grupos: number;
    certificados: number;
  };
  configuracion?: {
    horarios: string[];
    diasClase: string[];
    duracionClase: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ===============================================
// NIVEL
// ===============================================

export interface Nivel {
  id: string;
  nombre: string;
  descripcion: string;
  orden: number;
  edadMinima?: number;
  edadMaxima?: number;
  duracionMeses: number;
  requisitos?: string[];
  objetivos?: string[];
  contenido?: string[];
  estado: EstadoGeneral;
  certificadoTemplate?: string;
  createdAt: string;
  updatedAt: string;
}

// ===============================================
// GRUPO
// ===============================================

export interface Grupo {
  id: string;
  nombre: string;
  nivel: {
    id: string;
    nombre: string;
    orden: number;
  };
  parroquia: {
    id: string;
    nombre: string;
  };
  catequistas: Array<{
    id: string;
    nombres: string;
    apellidos: string;
    principal: boolean;
  }>;
  horario: {
    dia: string;
    horaInicio: string;
    horaFin: string;
    salon?: string;
  };
  fechaInicio: string;
  fechaFin?: string;
  cupoMaximo?: number;
  estado: EstadoGeneral;
  inscripciones?: {
    total: number;
    activas: number;
  };
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

// ===============================================
// CATEQUIZANDO
// ===============================================

export interface DatosPersonales {
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  edad?: number;
  genero: Genero;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  direccion: {
    provincia: string;
    canton: string;
    parroquia: string;
    sector?: string;
    calles: string;
    numeracion?: string;
    referencia?: string;
  };
  estadoCivil?: EstadoCivil;
  ocupacion?: string;
  institucionEducativa?: string;
  nivelEducativo?: string;
}

export interface Representante {
  id?: string;
  tipo: 'padre' | 'madre' | 'tutor' | 'abuelo' | 'otro';
  nombres: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  telefono: string;
  email?: string;
  direccion?: string;
  ocupacion?: string;
  parentesco?: string;
  principal: boolean;
}

export interface Padrino {
  id?: string;
  tipo: 'padrino' | 'madrina';
  nombres: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  parroquiaConfirmacion?: string;
}

export interface DatosBautismo {
  bautizado: boolean;
  fechaBautismo?: string;
  parroquiaBautismo?: string;
  libroBautismo?: string;
  folioBautismo?: string;
  numeroBautismo?: string;
  parroco?: string;
  padrinos?: Padrino[];
  observaciones?: string;
}

export interface Catequizando {
  id: string;
  datosPersonales: DatosPersonales;
  representantes: Representante[];
  datosBautismo: DatosBautismo;
  parroquia: {
    id: string;
    nombre: string;
  };
  estado: EstadoGeneral;
  inscripciones?: Inscripcion[];
  certificados?: Certificado[];
  observaciones?: Array<{
    fecha: string;
    usuario: string;
    contenido: string;
    tipo: 'general' | 'academica' | 'conductual' | 'salud';
  }>;
  documentos?: Array<{
    tipo: string;
    nombre: string;
    url: string;
    fechaSubida: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// ===============================================
// INSCRIPCIÓN
// ===============================================

export interface Inscripcion {
  id: string;
  catequizando: {
    id: string;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
  };
  grupo: {
    id: string;
    nombre: string;
    nivel: string;
    horario: string;
  };
  parroquia: {
    id: string;
    nombre: string;
  };
  fechaInscripcion: string;
  estado: 'pendiente' | 'activa' | 'completada' | 'retirada' | 'suspendida';
  pago: {
    monto: number;
    pagado: boolean;
    fechaPago?: string;
    metodoPago?: string;
    referencia?: string;
  };
  asistencias?: {
    total: number;
    presentes: number;
    ausentes: number;
    porcentaje: number;
  };
  calificaciones?: Array<{
    periodo: string;
    nota: number;
    observaciones?: string;
  }>;
  fechaRetiro?: string;
  motivoRetiro?: string;
  aprobado?: boolean;
  certificadoEmitido?: boolean;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

// ===============================================
// ASISTENCIA
// ===============================================

export interface Asistencia {
  id: string;
  inscripcion: {
    id: string;
    catequizando: {
      id: string;
      nombres: string;
      apellidos: string;
    };
  };
  grupo: {
    id: string;
    nombre: string;
    nivel: string;
  };
  fecha: string;
  asistio: boolean;
  tipoClase: 'regular' | 'especial' | 'retiro' | 'celebracion';
  justificado?: boolean;
  motivoAusencia?: string;
  observaciones?: string;
  registro: {
    registradoPor: string;
    fechaRegistro: string;
    metodo: 'manual' | 'masivo' | 'importado';
  };
  notificaciones?: {
    ausenciaNotificada: boolean;
    fechaNotificacion?: string;
    medioNotificacion?: 'email' | 'sms' | 'whatsapp';
  };
  createdAt: string;
  updatedAt: string;
}

// ===============================================
// CERTIFICADO
// ===============================================

export interface Certificado {
  id: string;
  catequizando: {
    id: string;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
  };
  nivel: {
    id: string;
    nombre: string;
    orden: number;
  };
  parroquia: {
    id: string;
    nombre: string;
    parroco: string;
  };
  grupo?: {
    id: string;
    nombre: string;
  };
  fechaEmision: string;
  numeroCertificado: string;
  serieCertificado?: string;
  estado: 'emitido' | 'anulado' | 'reenviado';
  template: string;
  firmantes: Array<{
    nombre: string;
    cargo: string;
    firma?: string;
  }>;
  validacion: {
    codigo: string;
    url: string;
    fechaExpiracion?: string;
  };
  entrega: {
    entregado: boolean;
    fechaEntrega?: string;
    recibioPor?: string;
    observaciones?: string;
  };
  archivo?: {
    url: string;
    tamaño: number;
    hash: string;
  };
  motivoAnulacion?: string;
  certificadoAnterior?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

// ===============================================
// USUARIO/CATEQUISTA
// ===============================================

export interface Usuario {
  id: string;
  username: string;
  email?: string;
  tipo: 'admin' | 'parroco' | 'secretaria' | 'catequista' | 'consulta';
  estado: 'activo' | 'inactivo' | 'bloqueado' | 'pendiente';
  datosPersonales: DatosPersonales;
  parroquia?: {
    id: string;
    nombre: string;
  };
  gruposAsignados?: Array<{
    id: string;
    nombre: string;
    nivel: string;
    principal: boolean;
  }>;
  permisos: string[];
  configuracion?: {
    notificaciones: boolean;
    tema: 'claro' | 'oscuro';
    idioma: string;
  };
  ultimoAcceso?: string;
  intentosFallidos?: number;
  bloqueadoHasta?: string;
  createdAt: string;
  updatedAt: string;
}

// ===============================================
// TIPOS DE FORMULARIOS
// ===============================================

export interface CatequizandoFormData {
  datosPersonales: Omit<DatosPersonales, 'edad'>;
  representantes: Representante[];
  datosBautismo: DatosBautismo;
  parroquiaId: string;
  observaciones?: string;
}

export interface GrupoFormData {
  nombre: string;
  nivelId: string;
  parroquiaId: string;
  catequistaIds: string[];
  horario: {
    dia: string;
    horaInicio: string;
    horaFin: string;
    salon?: string;
  };
  fechaInicio: string;
  fechaFin?: string;
  cupoMaximo?: number;
  observaciones?: string;
}

export interface InscripcionFormData {
  catequizandoId: string;
  grupoId: string;
  monto: number;
  pagado: boolean;
  fechaPago?: string;
  metodoPago?: string;
  referencia?: string;
  observaciones?: string;
}

export interface AsistenciaFormData {
  inscripcionId: string;
  fecha: string;
  asistio: boolean;
  tipoClase: 'regular' | 'especial' | 'retiro' | 'celebracion';
  justificado?: boolean;
  motivoAusencia?: string;
  observaciones?: string;
}

export interface CertificadoFormData {
  catequizandoId: string;
  nivelId: string;
  template: string;
  firmantes: Array<{
    nombre: string;
    cargo: string;
  }>;
  observaciones?: string;
}