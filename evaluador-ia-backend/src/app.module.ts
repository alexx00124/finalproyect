import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EvaluacionesModule } from './evaluaciones/evaluaciones.module';
import { AsignaturasModule } from './asignaturas/asignaturas.module';
import { ModulosModule } from './modulos/modulos.module';
import { AuthModule } from './auth/auth.module';
import { IaEvaluacionesModule } from './ia-evaluaciones/ia-evaluaciones.module'; // 👈 agregado

@Module({
  imports: [
    PrismaModule,
    EvaluacionesModule,
    AsignaturasModule,
    ModulosModule,
    AuthModule,
    IaEvaluacionesModule, // 👈 agregado
  ],
})
export class AppModule {}
