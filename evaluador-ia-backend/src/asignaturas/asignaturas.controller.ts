import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';
import { CreateAsignaturaDto, UpdateAsignaturaDto } from './dto';

@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly service: AsignaturasService) {}

  @Post()
  create(@Body() dto: CreateAsignaturaDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateAsignaturaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
