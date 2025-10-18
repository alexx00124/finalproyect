import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsignaturaDto, UpdateAsignaturaDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AsignaturasService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAsignaturaDto) {
    const data: Prisma.AsignaturaCreateInput = {
      codigo: dto.codigo,
      nombre: dto.nombre,
    };
    return this.prisma.asignatura.create({ data });
  }

  findAll() {
    return this.prisma.asignatura.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.asignatura.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateAsignaturaDto) {
    const data: Prisma.AsignaturaUpdateInput = {
      ...(dto.codigo ? { codigo: dto.codigo } : {}),
      ...(dto.nombre ? { nombre: dto.nombre } : {}),
    };
    return this.prisma.asignatura.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.asignatura.delete({ where: { id } });
  }
}
