// src/api/ia-evaluaciones.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/* ============================
   🧩 INTERFACES Y TIPOS
============================ */
export interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuesta_correcta: string;
  explicacion: string;
}

export interface EvaluacionGenerada {
  titulo: string;
  preguntas: Pregunta[];
}

export interface GenerarEvaluacionResponse {
  message: string;
  data: EvaluacionGenerada;
}

export interface GuardarEvaluacionRequest {
  titulo: string;
  preguntas: Pregunta[];
  moduloId: string;
}

export interface GuardarEvaluacionResponse {
  message: string;
  evaluacionId: string;
}

/* ============================
   🔐 UTILIDADES
============================ */
/**
 * Obtiene el token del usuario autenticado.
 */
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Configuración de headers con token
 */
function getAuthHeaders() {
  const token = getAuthToken();
  if (!token) throw new Error('No estás autenticado. Por favor inicia sesión.');
  
  return {
    Authorization: `Bearer ${token}`,
  };
}

/* ============================
   🤖 FUNCIONES PRINCIPALES
============================ */
/**
 * Genera una evaluación con IA a partir de un PDF.
 */
export async function generarEvaluacionConIA(
  pdf: File,
  moduloId: string
): Promise<GenerarEvaluacionResponse> {
  try {
    const formData = new FormData();
    formData.append('pdf', pdf);
    formData.append('moduloId', moduloId);

    const response = await axios.post<GenerarEvaluacionResponse>(
      `${API_URL}/ia-evaluaciones/generar`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error al generar evaluación';
    throw new Error(errorMessage);
  }
}

/**
 * Guarda una evaluación generada en la base de datos.
 */
export async function guardarEvaluacion(
  data: GuardarEvaluacionRequest
): Promise<GuardarEvaluacionResponse> {
  try {
    const response = await axios.post<GuardarEvaluacionResponse>(
      `${API_URL}/ia-evaluaciones/guardar`,
      data,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error al guardar evaluación';
    throw new Error(errorMessage);
  }
}

/* ============================
   📚 FUNCIONES OPCIONALES
============================ */
/**
 * Lista todas las evaluaciones generadas por IA.
 */
export async function listarEvaluacionesIA() {
  try {
    const response = await axios.get(`${API_URL}/ia-evaluaciones`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al cargar evaluaciones';
    throw new Error(errorMessage);
  }
}

/**
 * Obtiene una evaluación generada por IA por su ID.
 */
export async function getEvaluacionIA(id: string) {
  try {
    const response = await axios.get(`${API_URL}/ia-evaluaciones/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Error al cargar evaluación';
    throw new Error(errorMessage);
  }
}