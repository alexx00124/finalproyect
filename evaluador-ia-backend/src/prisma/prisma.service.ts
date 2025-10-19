import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma conectado a la base de datos SQLite');
  }

  async onModuleDestroy() {
    // Se ejecuta cuando NestJS se apaga (SIGINT/SIGTERM)
    await this.$disconnect();
    console.log('👋 Prisma desconectado');
  }
}
