// src/api/evaluador.ts
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ---- ASIGNATURAS ----
export async function getAsignaturas() {
  const res = await fetch(`${API_URL}/asignaturas`);1
  if (!res.ok) throw new Error('Error cargando asignaturas');
  return res.json();
}

// ---- EVALUACIONES ----
// Lista todas (lo usaremos para filtrar la de Módulo 1 / Intro a la Ingeniería)
export async function listEvaluaciones() {
  const res = await fetch(`${API_URL}/evaluaciones`);
  if (!res.ok) throw new Error('Error cargando evaluaciones');
  return res.json();
}

// Una evaluación por id
export async function getEvaluacion(id: string) {
  const res = await fetch(`${API_URL}/evaluaciones/${id}`);
  if (!res.ok) throw new Error('Error cargando evaluación');
  return res.json();
}

// Evaluaciones por módulo (si usas este endpoint en tu servicio)
export async function getEvaluacionesPorModulo(moduloId: string) {
  const res = await fetch(`${API_URL}/evaluaciones/modulo/${moduloId}`);
  if (!res.ok) throw new Error('Error cargando evaluaciones del módulo');
  return res.json();
}

// Enviar respuestas a una evaluación
export async function responderEvaluacion(
  evaluacionId: string,
  payload: {
    respuestas: Array<{ preguntaId: number; opcion: 'A' | 'B' | 'C' | 'D' }>;
  }
) {
  const res = await fetch(`${API_URL}/evaluaciones/${evaluacionId}/responder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Error al enviar respuestas');
  return res.json();
}
