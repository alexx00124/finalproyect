// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 👈 1. IMPORTA ESTO

import { PrismaModule } from './prisma/prisma.module';
import { EvaluacionesModule } from './evaluaciones/evaluaciones.module';
import { AsignaturasModule } from './asignaturas/asignaturas.module';
import { ModulosModule } from './modulos/modulos.module';
import { AuthModule } from './auth/auth.module';
import { IaEvaluacionesModule } from './ia-evaluaciones/ia-evaluaciones.module';

@Module({
  imports: [
    // 👈 2. AÑADE ESTE BLOQUE AQUÍ, NORMALMENTE AL PRINCIPIO
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que no necesites importar ConfigModule en otros módulos
    }),
    
    // Tus otros módulos que ya tenías
    PrismaModule,
    EvaluacionesModule,
    AsignaturasModule,
    ModulosModule,
    AuthModule,
    IaEvaluacionesModule,
  ],
})
export class AppModule {}