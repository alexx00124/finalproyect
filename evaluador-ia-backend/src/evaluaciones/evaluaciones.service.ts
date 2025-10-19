import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';

@Injectable()
export class EvaluacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEvaluacionDto) {
    try {
      return await this.prisma.evaluacion.create({
        data: {
          titulo: dto.titulo,
          contenido: dto.contenido,
          modulo: { connect: { id: dto.moduloId } },
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
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new NotFoundException('Módulo no encontrado para ese moduloId');
        if (e.code === 'P2002') throw new ConflictException('Ya existe una evaluación con ese título para el módulo');
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.evaluacion.findMany({
      include: {
        modulo: {
          select: {
            id: true,
            nombre: true,
            asignatura: { select: { nombre: true, codigo: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.evaluacion.findUnique({
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
    if (!row) throw new NotFoundException('Evaluación no encontrada');
    return row;
  }

  async update(id: string, dto: UpdateEvaluacionDto) {
    try {
      return await this.prisma.evaluacion.update({
        where: { id },
        data: {
          ...(dto.titulo ? { titulo: dto.titulo } : {}),
          ...(dto.contenido ? { contenido: dto.contenido } : {}),
          ...(dto.moduloId ? { modulo: { connect: { id: dto.moduloId } } } : {}),
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
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new NotFoundException('Registro no encontrado (evaluación o módulo)');
        if (e.code === 'P2002') throw new ConflictException('Ya existe una evaluación con ese título para el módulo');
      }
      throw e;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.evaluacion.delete({ where: { id } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025')
        throw new NotFoundException('Evaluación no encontrada');
      throw e;
    }
  }

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
}
