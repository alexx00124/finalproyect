import { EvaluacionesModule } from './evaluaciones/evaluaciones.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AsignaturasModule } from './asignaturas/asignaturas.module';
import { ModulosModule } from './modulos/modulos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EvaluacionesModule, PrismaModule, AsignaturasModule, ModulosModule, AuthModule],
})
export class AppModule {}
