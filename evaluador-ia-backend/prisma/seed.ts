import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Insertando datos iniciales...');

  // Ejemplo: usuario admin
  await prisma.usuario.create({
    data: {
      email: 'admin@devnodo.com',
      password: '123456', // ⚠️ En producción, encriptar
      nombre: 'Administrador',
    },
  });

  // Ejemplo: asignatura
  await prisma.asignatura.create({
    data: {
      nombre: 'Fundamentos de Programación',
      codigo: 'ASG-001',
    },
  });

  console.log('✅ Datos insertados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
