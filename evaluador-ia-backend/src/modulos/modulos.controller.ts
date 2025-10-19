import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Controller('modulos')
export class ModulosController {
  constructor(private readonly service: ModulosService) {}

  // ✅ Crear un nuevo módulo (requiere nombre y asignaturaId)
  @Post()
  create(@Body() dto: CreateModuloDto) {
    return this.service.create(dto);
  }

  // ✅ Listar todos los módulos con su asignatura
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ Listar módulos de una asignatura específica
  @Get('asignatura/:asignaturaId')
  findByAsignatura(@Param('asignaturaId') asignaturaId: string) {
    return this.service.findByAsignatura(asignaturaId);
  }

  // Obtener un módulo específico (por ID)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Actualizar un módulo existente
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModuloDto) {
    return this.service.update(id, dto);
  }

  // Eliminar un módulo
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
