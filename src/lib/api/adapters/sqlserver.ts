// ===============================================
// ADAPTADOR PARA BACKEND SQL SERVER
// ===============================================

import { createHttpClient } from '../client';
import { getEndpoints, buildFullUrl } from '../endpoints';
import type { 
  ApiResponse, 
  BackendAdapter, 
  PaginationParams, 
  FilterParams,
  QueryParams 
} from '../../types/api';
import type { 
  Parroquia, 
  Nivel, 
  Catequizando, 
  Grupo, 
  Inscripcion, 
  Asistencia,
  Certificado,
  CatequizandoFormData,
  GrupoFormData,
  InscripcionFormData,
  AsistenciaFormData,
  CertificadoFormData
} from '../../types/models';
import type { User, LoginCredentials, LoginResponse } from '../../types/auth';

/**
 * Configuración del adaptador SQL Server
 */
const SQLSERVER_CONFIG: BackendAdapter = {
  type: 'sqlserver',
  baseURL: process.env.NEXT_PUBLIC_SQLSERVER_URL || 'http://localhost:3000',
  version: 'v1',
  endpoints: getEndpoints('sqlserver'),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
};

// Cliente HTTP específico para SQL Server
const client = createHttpClient({
  baseURL: SQLSERVER_CONFIG.baseURL,
  timeout: SQLSERVER_CONFIG.timeout,
});

// ===============================================
// SERVICIOS DE AUTENTICACIÓN
// ===============================================

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await client.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<ApiResponse> {
    return await client.post('/api/auth/logout');
  },

  /**
   * Obtener perfil del usuario
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return await client.get('/api/auth/profile');
  },

  /**
   * Renovar token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    return await client.post('/api/auth/refresh', { refreshToken });
  },
};

// ===============================================
// SERVICIOS DE PARROQUIAS
// ===============================================

export const parroquiaService = {
  /**
   * Obtener todas las parroquias
   */
  async getAll(params?: QueryParams): Promise<ApiResponse<Parroquia[]>> {
    const url = buildFullUrl('/api/parroquias', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener parroquia por ID
   */
  async getById(id: string): Promise<ApiResponse<Parroquia>> {
    return await client.get(`/api/parroquias/${id}`);
  },

  /**
   * Crear nueva parroquia
   */
  async create(data: Partial<Parroquia>): Promise<ApiResponse<Parroquia>> {
    return await client.post('/api/parroquias', data);
  },

  /**
   * Actualizar parroquia
   */
  async update(id: string, data: Partial<Parroquia>): Promise<ApiResponse<Parroquia>> {
    return await client.put(`/api/parroquias/${id}`, data);
  },

  /**
   * Eliminar parroquia
   */
  async delete(id: string): Promise<ApiResponse> {
    return await client.delete(`/api/parroquias/${id}`);
  },

  /**
   * Buscar parroquias
   */
  async search(query: string, filters?: FilterParams): Promise<ApiResponse<Parroquia[]>> {
    const params = { q: query, ...filters };
    const url = buildFullUrl('/api/parroquias/search', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener estadísticas de parroquia
   */
  async getStats(id: string): Promise<ApiResponse<any>> {
    return await client.get(`/api/parroquias/${id}/stats`);
  },
};

// ===============================================
// SERVICIOS DE NIVELES
// ===============================================

export const nivelService = {
  /**
   * Obtener todos los niveles
   */
  async getAll(params?: QueryParams): Promise<ApiResponse<Nivel[]>> {
    const url = buildFullUrl('/api/niveles', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener niveles ordenados
   */
  async getOrdered(): Promise<ApiResponse<Nivel[]>> {
    return await client.get('/api/niveles/ordenados');
  },

  /**
   * Obtener nivel por ID
   */
  async getById(id: string): Promise<ApiResponse<Nivel>> {
    return await client.get(`/api/niveles/${id}`);
  },

  /**
   * Crear nuevo nivel
   */
  async create(data: Partial<Nivel>): Promise<ApiResponse<Nivel>> {
    return await client.post('/api/niveles', data);
  },

  /**
   * Actualizar nivel
   */
  async update(id: string, data: Partial<Nivel>): Promise<ApiResponse<Nivel>> {
    return await client.put(`/api/niveles/${id}`, data);
  },

  /**
   * Eliminar nivel
   */
  async delete(id: string): Promise<ApiResponse> {
    return await client.delete(`/api/niveles/${id}`);
  },

  /**
   * Reordenar niveles
   */
  async reorder(levels: Array<{ id: string; orden: number }>): Promise<ApiResponse> {
    return await client.put('/api/niveles/reorder', { levels });
  },

  /**
   * Obtener estadísticas de nivel
   */
  async getStats(id: string): Promise<ApiResponse<any>> {
    return await client.get(`/api/niveles/${id}/stats`);
  },
};

// ===============================================
// SERVICIOS DE CATEQUIZANDOS
// ===============================================

export const catequizandoService = {
  /**
   * Obtener todos los catequizandos
   */
  async getAll(params?: QueryParams): Promise<ApiResponse<Catequizando[]>> {
    const url = buildFullUrl('/api/catequizandos', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener catequizando por ID
   */
  async getById(id: string): Promise<ApiResponse<Catequizando>> {
    return await client.get(`/api/catequizandos/${id}`);
  },

  /**
   * Obtener catequizando por documento
   */
  async getByDocument(documento: string): Promise<ApiResponse<Catequizando>> {
    return await client.get(`/api/catequizandos/documento/${documento}`);
  },

  /**
   * Crear nuevo catequizando
   */
  async create(data: CatequizandoFormData): Promise<ApiResponse<Catequizando>> {
    return await client.post('/api/catequizandos', data);
  },

  /**
   * Actualizar catequizando
   */
  async update(id: string, data: Partial<CatequizandoFormData>): Promise<ApiResponse<Catequizando>> {
    return await client.put(`/api/catequizandos/${id}`, data);
  },

  /**
   * Eliminar catequizando
   */
  async delete(id: string): Promise<ApiResponse> {
    return await client.delete(`/api/catequizandos/${id}`);
  },

  /**
   * Buscar catequizandos
   */
  async search(query: string, filters?: FilterParams): Promise<ApiResponse<Catequizando[]>> {
    const params = { q: query, ...filters };
    const url = buildFullUrl('/api/catequizandos/search', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener estadísticas de catequizandos
   */
  async getStats(): Promise<ApiResponse<any>> {
    return await client.get('/api/catequizandos/stats');
  },

  /**
   * Obtener inscripciones de catequizando
   */
  async getInscripciones(id: string): Promise<ApiResponse<Inscripcion[]>> {
    return await client.get(`/api/catequizandos/${id}/inscripciones`);
  },

  /**
   * Obtener certificados de catequizando
   */
  async getCertificados(id: string): Promise<ApiResponse<Certificado[]>> {
    return await client.get(`/api/catequizandos/${id}/certificados`);
  },

  /**
   * Validar elegibilidad para inscripción
   */
  async validateInscription(id: string, nivelId: string): Promise<ApiResponse<any>> {
    return await client.post(`/api/catequizandos/${id}/validar-inscripcion`, { nivelId });
  },
};

// ===============================================
// SERVICIOS DE GRUPOS
// ===============================================

export const grupoService = {
  /**
   * Obtener todos los grupos
   */
  async getAll(params?: QueryParams): Promise<ApiResponse<Grupo[]>> {
    const url = buildFullUrl('/api/grupos', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener grupo por ID
   */
  async getById(id: string): Promise<ApiResponse<Grupo>> {
    return await client.get(`/api/grupos/${id}`);
  },

  /**
   * Obtener grupos por parroquia
   */
  async getByParroquia(parroquiaId: string): Promise<ApiResponse<Grupo[]>> {
    return await client.get(`/api/grupos/parroquia/${parroquiaId}`);
  },

  /**
   * Obtener grupos por nivel
   */
  async getByNivel(nivelId: string): Promise<ApiResponse<Grupo[]>> {
    return await client.get(`/api/grupos/nivel/${nivelId}`);
  },

  /**
   * Crear nuevo grupo
   */
  async create(data: GrupoFormData): Promise<ApiResponse<Grupo>> {
    return await client.post('/api/grupos', data);
  },

  /**
   * Actualizar grupo
   */
  async update(id: string, data: Partial<GrupoFormData>): Promise<ApiResponse<Grupo>> {
    return await client.put(`/api/grupos/${id}`, data);
  },

  /**
   * Eliminar grupo
   */
  async delete(id: string): Promise<ApiResponse> {
    return await client.delete(`/api/grupos/${id}`);
  },

  /**
   * Buscar grupos
   */
  async search(query: string, filters?: FilterParams): Promise<ApiResponse<Grupo[]>> {
    const params = { q: query, ...filters };
    const url = buildFullUrl('/api/grupos/search', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener inscripciones de grupo
   */
  async getInscripciones(id: string): Promise<ApiResponse<Inscripcion[]>> {
    return await client.get(`/api/grupos/${id}/inscripciones`);
  },

  /**
   * Obtener catequistas de grupo
   */
  async getCatequistas(id: string): Promise<ApiResponse<User[]>> {
    return await client.get(`/api/grupos/${id}/catequistas`);
  },

  /**
   * Obtener estadísticas de grupo
   */
  async getStats(id: string): Promise<ApiResponse<any>> {
    return await client.get(`/api/grupos/${id}/stats`);
  },
};

// ===============================================
// SERVICIOS DE INSCRIPCIONES
// ===============================================

export const inscripcionService = {
  /**
   * Obtener todas las inscripciones
   */
  async getAll(params?: QueryParams): Promise<ApiResponse<Inscripcion[]>> {
    const url = buildFullUrl('/api/inscripciones', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener inscripción por ID
   */
  async getById(id: string): Promise<ApiResponse<Inscripcion>> {
    return await client.get(`/api/inscripciones/${id}`);
  },

  /**
   * Crear nueva inscripción
   */
  async create(data: InscripcionFormData): Promise<ApiResponse<Inscripcion>> {
    return await client.post('/api/inscripciones', data);
  },

  /**
   * Inscribir catequizando (con validaciones)
   */
  async inscribir(data: InscripcionFormData): Promise<ApiResponse<Inscripcion>> {
    return await client.post('/api/inscripciones/inscribir', data);
  },

  /**
   * Actualizar inscripción
   */
  async update(id: string, data: Partial<InscripcionFormData>): Promise<ApiResponse<Inscripcion>> {
    return await client.put(`/api/inscripciones/${id}`, data);
  },

  /**
   * Actualizar pago de inscripción
   */
  async updatePago(id: string, pagoData: any): Promise<ApiResponse<Inscripcion>> {
    return await client.put(`/api/inscripciones/${id}/pago`, pagoData);
  },

  /**
   * Eliminar inscripción
   */
  async delete(id: string): Promise<ApiResponse> {
    return await client.delete(`/api/inscripciones/${id}`);
  },

  /**
   * Obtener inscripciones por catequizando
   */
  async getByCatequizando(catequizandoId: string): Promise<ApiResponse<Inscripcion[]>> {
    return await client.get(`/api/inscripciones/catequizando/${catequizandoId}`);
  },

  /**
   * Obtener inscripciones por grupo
   */
  async getByGrupo(grupoId: string): Promise<ApiResponse<Inscripcion[]>> {
    return await client.get(`/api/inscripciones/grupo/${grupoId}`);
  },

  /**
   * Buscar inscripciones
   */
  async search(query: string, filters?: FilterParams): Promise<ApiResponse<Inscripcion[]>> {
    const params = { q: query, ...filters };
    const url = buildFullUrl('/api/inscripciones/search', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener estadísticas de inscripciones
   */
  async getStats(): Promise<ApiResponse<any>> {
    return await client.get('/api/inscripciones/stats');
  },

  /**
   * Obtener inscripciones pendientes de pago
   */
  async getPendientesPago(): Promise<ApiResponse<Inscripcion[]>> {
    return await client.get('/api/inscripciones/pendientes-pago');
  },
};

// ===============================================
// SERVICIOS DE ASISTENCIA
// ===============================================

export const asistenciaService = {
  /**
   * Obtener todas las asistencias
   */
  async getAll(params?: QueryParams): Promise<ApiResponse<Asistencia[]>> {
    const url = buildFullUrl('/api/asistencias', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener asistencia por ID
   */
  async getById(id: string): Promise<ApiResponse<Asistencia>> {
    return await client.get(`/api/asistencias/${id}`);
  },

  /**
   * Registrar asistencia individual
   */
  async create(data: AsistenciaFormData): Promise<ApiResponse<Asistencia>> {
    return await client.post('/api/asistencias', data);
  },

  /**
   * Registrar asistencia masiva por grupo
   */
  async registrarGrupo(grupoId: string, data: any): Promise<ApiResponse<Asistencia[]>> {
    return await client.post(`/api/asistencias/grupo/${grupoId}`, data);
  },

  /**
   * Actualizar asistencia
   */
  async update(id: string, data: Partial<AsistenciaFormData>): Promise<ApiResponse<Asistencia>> {
    return await client.put(`/api/asistencias/${id}`, data);
  },

  /**
   * Eliminar asistencia
   */
  async delete(id: string): Promise<ApiResponse> {
    return await client.delete(`/api/asistencias/${id}`);
  },

  /**
   * Obtener asistencias por inscripción
   */
  async getByInscripcion(inscripcionId: string): Promise<ApiResponse<Asistencia[]>> {
    return await client.get(`/api/asistencias/inscripcion/${inscripcionId}`);
  },

  /**
   * Obtener asistencias por grupo y fecha
   */
  async getByGrupoFecha(grupoId: string, fecha: string): Promise<ApiResponse<Asistencia[]>> {
    return await client.get(`/api/asistencias/grupo/${grupoId}/fecha/${fecha}`);
  },

  /**
   * Obtener reporte de asistencia
   */
  async getReporte(params?: FilterParams): Promise<ApiResponse<any>> {
    const url = buildFullUrl('/api/asistencias/reporte', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener estadísticas generales
   */
  async getStats(): Promise<ApiResponse<any>> {
    return await client.get('/api/asistencias/stats');
  },

  /**
   * Obtener estadísticas por grupo
   */
  async getStatsGrupo(grupoId: string, params?: FilterParams): Promise<ApiResponse<any>> {
    const url = buildFullUrl(`/api/asistencias/stats/grupo/${grupoId}`, undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener estudiantes con baja asistencia
   */
  async getBajaAsistencia(): Promise<ApiResponse<any[]>> {
    return await client.get('/api/asistencias/baja-asistencia');
  },

  /**
   * Obtener ausencias pendientes de notificar
   */
  async getAusenciasPendientes(): Promise<ApiResponse<any[]>> {
    return await client.get('/api/asistencias/ausencias-pendientes');
  },
};

// ===============================================
// SERVICIOS DE CERTIFICADOS
// ===============================================

export const certificadoService = {
  /**
   * Obtener todos los certificados
   */
  async getAll(params?: QueryParams): Promise<ApiResponse<Certificado[]>> {
    const url = buildFullUrl('/api/certificados', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener certificado por ID
   */
  async getById(id: string): Promise<ApiResponse<Certificado>> {
    return await client.get(`/api/certificados/${id}`);
  },

  /**
   * Emitir certificado individual
   */
  async emitir(data: CertificadoFormData): Promise<ApiResponse<Certificado>> {
    return await client.post('/api/certificados/emitir', data);
  },

  /**
   * Emisión masiva de certificados
   */
  async emisionMasiva(data: any): Promise<ApiResponse<Certificado[]>> {
    return await client.post('/api/certificados/masivo', data);
  },

  /**
   * Descargar certificado en PDF
   */
  async download(id: string): Promise<void> {
    return await client.download(`/api/certificados/${id}/download`);
  },

  /**
   * Validar certificado por código
   */
  async validate(codigo: string): Promise<ApiResponse<any>> {
    return await client.get(`/api/certificados/${codigo}/validate`);
  },
};

// ===============================================
// SERVICIOS ESPECÍFICOS DE SQL SERVER
// ===============================================

export const catequistaService = {
  /**
   * Obtener todos los catequistas
   */
  async getAll(params?: QueryParams): Promise<ApiResponse<User[]>> {
    const url = buildFullUrl('/api/catequistas', undefined, params);
    return await client.get(url);
  },

  /**
   * Obtener catequista por ID
   */
  async getById(id: string): Promise<ApiResponse<User>> {
    return await client.get(`/api/catequistas/${id}`);
  },

  /**
   * Crear nuevo catequista
   */
  async create(data: any): Promise<ApiResponse<User>> {
    return await client.post('/api/catequistas', data);
  },

  /**
   * Actualizar catequista
   */
  async update(id: string, data: any): Promise<ApiResponse<User>> {
    return await client.put(`/api/catequistas/${id}`, data);
  },

  /**
   * Eliminar catequista
   */
  async delete(id: string): Promise<ApiResponse> {
    return await client.delete(`/api/catequistas/${id}`);
  },
};

// ===============================================
// EXPORTACIÓN DEL ADAPTADOR
// ===============================================

export const sqlServerAdapter = {
  config: SQLSERVER_CONFIG,
  auth: authService,
  parroquias: parroquiaService,
  niveles: nivelService,
  catequizandos: catequizandoService,
  grupos: grupoService,
  inscripciones: inscripcionService,
  asistencias: asistenciaService,
  certificados: certificadoService,
  catequistas: catequistaService,
  client,
};

export default sqlServerAdapter;