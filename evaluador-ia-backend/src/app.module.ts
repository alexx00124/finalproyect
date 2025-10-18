import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AsignaturasModule } from './asignaturas/asignaturas.module';
import { ModulosModule } from './modulos/modulos.module';

@Module({
  imports: [PrismaModule, AsignaturasModule, ModulosModule],
})
export class AppModule {}
