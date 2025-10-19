import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';

type Respuesta = { preguntaId: number; opcion: 'A' | 'B' | 'C' | 'D' };

@Injectable()
export class EvaluacionesService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear evaluación
  async create(dto: CreateEvaluacionDto) {
    // (opcional) validar que el módulo exista
    const modulo = await this.prisma.modulo.findUnique({ where: { id: dto.moduloId } });
    if (!modulo) throw new NotFoundException('Módulo no encontrado para ese moduloId');

    return this.prisma.evaluacion.create({
      data: {
        titulo: dto.titulo,
        contenido: dto.contenido,
        moduloId: dto.moduloId,
      },
      include: {
        modulo: {
          select: {
            id: true,
            nombre: true,
            asignatura: { select: { nombre: true, codigo: true } },
          },
        },
      },
    });
  }

  // Listar todas
  findAll() {
    return this.prisma.evaluacion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        modulo: {
          select: {
            id: true,
            nombre: true,
            asignatura: { select: { nombre: true, codigo: true } },
          },
        },
      },
    });
  }

  // Obtener una
  async findOne(id: string) {
    const ev = await this.prisma.evaluacion.findUnique({
      where: { id },
      include: {
        modulo: {
          select: {
            id: true,
            nombre: true,
            asignatura: { select: { nombre: true, codigo: true } },
          },
        },
      },
    });
    if (!ev) throw new NotFoundException('Evaluación no encontrada');
    return ev;
  }

  // Actualizar
  async update(id: string, dto: UpdateEvaluacionDto) {
    // (opcional) validar moduloId si viene en el DTO
    if (dto.moduloId) {
      const modulo = await this.prisma.modulo.findUnique({ where: { id: dto.moduloId } });
      if (!modulo) throw new NotFoundException('Módulo no encontrado para ese moduloId');
    }

    return this.prisma.evaluacion.update({
      where: { id },
      data: dto,
      include: {
        modulo: {
          select: {
            id: true,
            nombre: true,
            asignatura: { select: { nombre: true, codigo: true } },
          },
        },
      },
    });
  }

  // Eliminar
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.evaluacion.delete({ where: { id } });
  }

  // Listar por módulo
  findByModulo(moduloId: string) {
    return this.prisma.evaluacion.findMany({
      where: { moduloId },
      orderBy: { createdAt: 'desc' },
      include: {
        modulo: {
          select: {
            id: true,
            nombre: true,
            asignatura: { select: { nombre: true, codigo: true } },
          },
        },
      },
    });
  }

  // --- NUEVO: Calificar respuestas de una evaluación con contenido JSON ---
  async calificar(evaluacionId: string, respuestas: Respuesta[]) {
    // 1) Traer la evaluación
    const ev = await this.prisma.evaluacion.findUnique({ where: { id: evaluacionId } });
    if (!ev) throw new NotFoundException('Evaluación no encontrada');

    // 2) Parsear JSON del contenido
    const raw = ev.contenido ?? '';
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new BadRequestException(
        'Esta evaluación no tiene preguntas en formato JSON (contenido no corregible).',
      );
    }

    const preguntas = Array.isArray(data?.preguntas) ? data.preguntas : [];
    if (preguntas.length === 0) {
      throw new BadRequestException('Evaluación sin preguntas válidas.');
    }

    // 3) Indexar respuestas enviadas
    const mapa = new Map<number, 'A' | 'B' | 'C' | 'D'>();
    for (const r of respuestas) mapa.set(r.preguntaId, r.opcion);

    // 4) Calcular resultado
    let correctas = 0;
    const detalle = preguntas.map((p: any) => {
      const tu = mapa.get(p.id) ?? null;
      const ok = p.correcta as 'A' | 'B' | 'C' | 'D';
      const acierto = tu === ok;
      if (acierto) correctas++;
      return {
        preguntaId: p.id,
        enunciado: p.enunciado,
        tuRespuesta: tu,
        correcta: ok,
        acierto,
      };
    });

    const total = preguntas.length;
    const porcentaje = Math.round((correctas / total) * 100);

    let mensaje: string;
    if (porcentaje >= 80) mensaje = '¡Súper bien! Lo hiciste genial 🎉';
    else if (porcentaje >= 60) mensaje = 'Vas bien, sigue practicando 💪';
    else mensaje = 'Tienes que mejorar en estas preguntas. Revisa el material 📚';

    return {
      evaluacionId,
      total,
      correctas,
      porcentaje,
      mensaje,
      detalle,
    };
  }
}
