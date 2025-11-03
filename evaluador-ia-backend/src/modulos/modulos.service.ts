// src/modulos/modulos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Injectable()
export class ModulosService {
  constructor(private readonly prisma: PrismaService) {}

  /** Reutilizamos este include en todos los métodos */
  private readonly moduloInclude = {
    asignatura: { select: { nombre: true, codigo: true } },
  } as const;

  async create(dto: CreateModuloDto) {
    const data: Prisma.ModuloCreateInput = {
      nombre: dto.nombre,
      asignatura: { connect: { id: dto.asignaturaId } },
    };
    try {
      return await this.prisma.modulo.create({
        data,
        include: this.moduloInclude,
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(
            'Asignatura no encontrada para ese asignaturaId',
          );
        }
        // Único: por si tienes @@unique([asignaturaId, nombre])
        if (e.code === 'P2002') {
          throw new ConflictException(
            'Ya existe un módulo con ese nombre para esta asignatura',
          );
        }
      }
      throw e;
    }
  }

  findAll() {
    return this.prisma.modulo.findMany({
      include: this.moduloInclude,
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.modulo.findUnique({
      where: { id },
      include: this.moduloInclude,
    });
    if (!row) throw new NotFoundException('Módulo no encontrado');
    return row;
  }

  async update(id: string, dto: UpdateModuloDto) {
    const data: Prisma.ModuloUpdateInput = {
      ...(dto.nombre ? { nombre: dto.nombre } : {}),
      ...(dto.asignaturaId
        ? { asignatura: { connect: { id: dto.asignaturaId } } }
        : {}),
    };
    try {
      return await this.prisma.modulo.update({
        where: { id },
        data,
        include: this.moduloInclude,
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new NotFoundException(
            'Registro no encontrado (módulo o asignatura)',
          );
        }
        if (e.code === 'P2002') {
          throw new ConflictException(
            'Ya existe un módulo con ese nombre para esta asignatura',
          );
        }
      }
      throw e;
    }
  }

  async remove(id: string) {
    try {
      // Si prefieres devolver también la asignatura borrada, usa `include: this.moduloInclude`
      return await this.prisma.modulo.delete({ where: { id } });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Módulo no encontrado');
      }
      throw e;
    }
  }

  /** Lista módulos por asignatura (materia) e incluye datos de la asignatura */
  findByAsignatura(asignaturaId: string) {
    return this.prisma.modulo.findMany({
      where: { asignaturaId },
      orderBy: { nombre: 'asc' },
      include: this.moduloInclude, // ← ACTIVADO
    });
  }
}
