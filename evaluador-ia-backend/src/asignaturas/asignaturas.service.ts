import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsignaturaDto, UpdateAsignaturaDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AsignaturasService {
  constructor(private prisma: PrismaService) {}

  // Crear una nueva asignatura
  create(dto: CreateAsignaturaDto) {
    const data: Prisma.AsignaturaCreateInput = {
      codigo: dto.codigo,
      nombre: dto.nombre,
    };
    return this.prisma.asignatura.create({ data });
  }

  // Listar todas las asignaturas (ordenadas por nombre)
  findAll() {
    return this.prisma.asignatura.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  // Obtener una asignatura específica
  findOne(id: string) {
    return this.prisma.asignatura.findUnique({ where: { id } });
  }

  // Actualizar una asignatura (no usado aún en FASE 2)
  update(id: string, dto: UpdateAsignaturaDto) {
    const data: Prisma.AsignaturaUpdateInput = {
      ...(dto.codigo ? { codigo: dto.codigo } : {}),
      ...(dto.nombre ? { nombre: dto.nombre } : {}),
    };
    return this.prisma.asignatura.update({ where: { id }, data });
  }

  // Eliminar una asignatura (no usado aún en FASE 2)
  remove(id: string) {
    return this.prisma.asignatura.delete({ where: { id } });
  }
}
