import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ModulosService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateModuloDto) {
    const data: Prisma.ModuloCreateInput = {
      nombre: dto.nombre,
      asignatura: { connect: { id: dto.asignaturaId } },
    };
    return this.prisma.modulo.create({ data });
  }

  findAll() {
    return this.prisma.modulo.findMany({
      include: { asignatura: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.modulo.findUnique({
      where: { id },
      include: { asignatura: true },
    });
  }

  update(id: string, dto: UpdateModuloDto) {
    const data: Prisma.ModuloUpdateInput = {
      ...(dto.nombre ? { nombre: dto.nombre } : {}),
      ...(dto.asignaturaId
        ? {
            asignatura: {
              connect: { id: dto.asignaturaId },
            },
          }
        : {}),
    };

    return this.prisma.modulo.update({
      where: { id },
      data,
      include: { asignatura: true },
    });
  }

  remove(id: string) {
    return this.prisma.modulo.delete({ where: { id } });
  }

  findByAsignatura(asignaturaId: string) {
    return this.prisma.modulo.findMany({
      where: { asignaturaId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
