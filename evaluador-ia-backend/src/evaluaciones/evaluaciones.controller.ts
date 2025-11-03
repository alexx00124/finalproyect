import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';

@Controller('evaluaciones')
export class EvaluacionesController {
  constructor(private readonly service: EvaluacionesService) {}

  @Post()
  create(@Body() dto: CreateEvaluacionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEvaluacionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('modulo/:moduloId')
  byModulo(@Param('moduloId') moduloId: string) {
    return this.service.findByModulo(moduloId);
  }

  // --- NUEVO: responder y calificar una evaluación ---
  @Post(':id/responder')
  responder(
    @Param('id') id: string,
    @Body()
    body: {
      respuestas: Array<{ preguntaId: number; opcion: 'A' | 'B' | 'C' | 'D' }>;
    },
  ) {
    return this.service.calificar(id, body?.respuestas ?? []);
  }
}
