import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // CORS para tu React (vite en 5173)
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });

  // Validaciones globales de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos extra
      forbidNonWhitelisted: true, // error si mandan campos no permitidos
      transform: true, // convierte tipos (string->number, etc.)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err: unknown) => {
  console.error('Error al iniciar la app:', err);
  process.exit(1);
});
