import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';
import { Pregunta, EvaluacionGenerada } from './interfaces/evaluacion.interface';
import { ConfigService } from '@nestjs/config';

// import dinámico de pdf-parse como lo tienes
import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;

@Injectable()
export class IaEvaluacionesService {
  private readonly logger = new Logger(IaEvaluacionesService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      // No me caigas toda la app, pero avísame en logs
      this.logger.error(
        '⚠️ GEMINI_API_KEY no está configurada en el .env. La generación con IA no va a funcionar.',
      );
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  private async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
      this.logger.log(
        `📖 Intentando leer PDF, tamaño del buffer: ${buffer?.length ?? 0} bytes`,
      );

      if (!buffer || buffer.length === 0) {
        throw new Error('El buffer del PDF está vacío');
      }

      const data = await pdfParse(buffer);

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('El PDF no contiene texto extraíble');
      }

      this.logger.log(
        `✅ PDF leído exitosamente, caracteres extraídos: ${data.text.length}`,
      );

      return data.text;
    } catch (error: any) {
      this.logger.error('❌ Error detallado al leer PDF:', error);

      if (error.message?.includes('Invalid PDF')) {
        throw new BadRequestException(
          'El archivo no es un PDF válido o está corrupto',
        );
      }
      if (error.message?.includes('encrypted')) {
        throw new BadRequestException(
          'El PDF está protegido con contraseña',
        );
      }
      throw new BadRequestException(
        `Error al leer el PDF: ${error.message}. Asegúrate de que sea un archivo válido y no esté protegido.`,
      );
    }
  }

  async generarEvaluacion(
    pdfBuffer: Buffer,
    moduloId: string,
  ): Promise<EvaluacionGenerada> {
    // 1. Extraer texto del PDF
    const textoExtraido = await this.extractTextFromPDF(pdfBuffer);

    if (!textoExtraido || textoExtraido.trim().length < 50) {
      throw new BadRequestException(
        'El PDF no contiene suficiente texto para generar preguntas.',
      );
    }

    // 2. Validar que el módulo existe
    const modulo = await this.prisma.modulo.findUnique({
      where: { id: moduloId },
      include: { asignatura: true },
    });

    if (!modulo) {
      throw new BadRequestException('El módulo especificado no existe.');
    }

    // 3. Si no hay genAI inicializado porque no había API key, devolvemos fallback
    if (!this.genAI) {
      this.logger.warn(
        '⚠️ No hay GEMINI_API_KEY configurada. Devolviendo preguntas de fallback.',
      );
      return this.generarFallback(modulo.nombre);
    }

    // 4. Generar preguntas con Gemini
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Eres un profesor experto creando evaluaciones académicas. 

Basándote ÚNICAMENTE en el siguiente contenido del temario, genera exactamente 5 preguntas de opción múltiple.

CONTENIDO DEL TEMARIO:
${textoExtraido.substring(0, 8000)}

INSTRUCCIONES:
1. Cada pregunta debe tener 4 opciones (A, B, C, D)
2. Solo UNA opción es correcta
3. Las preguntas deben ser claras y evaluar comprensión del tema
4. Incluye una breve explicación de por qué la respuesta es correcta
5. Las preguntas deben ser relevantes al contenido proporcionado

FORMATO DE RESPUESTA (JSON válido):
{
  "preguntas": [
    {
      "pregunta": "Texto de la pregunta",
      "opciones": ["A) Opción 1", "B) Opción 2", "C) Opción 3", "D) Opción 4"],
      "respuesta_correcta": "A) Opción 1",
      "explicacion": "Explicación breve de por qué esta es la respuesta correcta"
    }
  ]
}

Genera SOLO el JSON, sin texto adicional.
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanedText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsedResponse = JSON.parse(cleanedText);

      if (!parsedResponse.preguntas || parsedResponse.preguntas.length !== 5) {
        throw new Error('La IA no generó exactamente 5 preguntas');
      }

      return {
        titulo: `Evaluación - ${modulo.nombre}`,
        preguntas: parsedResponse.preguntas,
      };
    } catch (error) {
      this.logger.error('Error al generar preguntas con Gemini:', error);
      return this.generarFallback(modulo.nombre);
    }
  }

  private generarFallback(nombreModulo: string): EvaluacionGenerada {
    const preguntasPrueba: Pregunta[] = [
      {
        pregunta:
          'Según el contenido del PDF, ¿cuál es el concepto principal tratado?',
        opciones: [
          'A) Fundamentos básicos del tema',
          'B) Aplicaciones prácticas avanzadas',
          'C) Historia del desarrollo',
          'D) Casos de estudio específicos',
        ],
        respuesta_correcta: 'A) Fundamentos básicos del tema',
        explicacion:
          'El documento se enfoca principalmente en explicar los fundamentos del tema tratado.',
      },
      {
        pregunta:
          '¿Qué metodología se recomienda en el material presentado?',
        opciones: [
          'A) Enfoque teórico puro sin práctica',
          'B) Práctica guiada con ejemplos concretos',
          'C) Autoaprendizaje sin guía estructurada',
          'D) Memorización de conceptos sin aplicación',
        ],
        respuesta_correcta:
          'B) Práctica guiada con ejemplos concretos',
        explicacion:
          'El material enfatiza la importancia de practicar con ejemplos concretos para mejor comprensión.',
      },
      {
        pregunta:
          '¿Cuál es el objetivo principal del contenido presentado?',
        opciones: [
          'A) Proporcionar información general básica',
          'B) Desarrollar habilidades específicas del área',
          'C) Presentar únicamente casos históricos',
          'D) Enumerar recursos adicionales externos',
        ],
        respuesta_correcta:
          'B) Desarrollar habilidades específicas del área',
        explicacion:
          'El contenido busca que el estudiante desarrolle competencias prácticas en el área.',
      },
      {
        pregunta:
          'Según el PDF, ¿qué aspecto es más importante dominar inicialmente?',
        opciones: [
          'A) Los conceptos fundamentales y básicos',
          'B) Las herramientas tecnológicas avanzadas',
          'C) La terminología técnica especializada',
          'D) Las tendencias actuales del mercado',
        ],
        respuesta_correcta:
          'A) Los conceptos fundamentales y básicos',
        explicacion:
          'El dominio de conceptos base es esencial antes de avanzar a temas más complejos.',
      },
      {
        pregunta:
          '¿Qué estrategia se recomienda para un mejor aprendizaje del tema?',
        opciones: [
          'A) Leer el material una sola vez rápidamente',
          'B) Practicar y revisar el contenido constantemente',
          'C) Memorizar sin comprender el contexto',
          'D) Saltarse los ejemplos y ejercicios',
        ],
        respuesta_correcta:
          'B) Practicar y revisar el contenido constantemente',
        explicacion:
          'La práctica continua y la revisión periódica son claves para la retención efectiva del conocimiento.',
      },
    ];

    return {
      titulo: `Evaluación - ${nombreModulo}`,
      preguntas: preguntasPrueba,
    };
  }

  async guardarEvaluacion(
    titulo: string,
    preguntas: Pregunta[],
    moduloId: string,
  ): Promise<{ message: string; evaluacionId: string }> {
    const evaluacion = await this.prisma.evaluacion.create({
      data: {
        titulo,
        contenido: JSON.stringify(preguntas),
        moduloId,
      },
    });

    return {
      message: 'Evaluación guardada exitosamente',
      evaluacionId: evaluacion.id,
    };
  }
}
