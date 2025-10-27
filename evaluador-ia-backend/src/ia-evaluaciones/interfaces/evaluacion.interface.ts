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