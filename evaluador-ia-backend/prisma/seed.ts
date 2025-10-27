import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Insertando datos iniciales...');

  // 🔹 Verifica si ya existe el usuario admin
  const adminEmail = 'admin@devnodo.com';
  const adminExists = await prisma.usuario.findUnique({
    where: { email: adminEmail },
  });

  if (!adminExists) {
    const adminPassword = await bcrypt.hash('123456', 10);
    await prisma.usuario.create({
      data: {
        email: adminEmail,
        password: adminPassword,
        nombre: 'Administrador',
        rol: 'admin',
      },
    });
    console.log('✅ Usuario admin creado');
  } else {
    console.log('⚠️ Usuario admin ya existe, omitido');
  }

  // 🔹 Verifica si ya existe el usuario docente
  const docenteEmail = 'docente@admin.com';
  const docenteExists = await prisma.usuario.findUnique({
    where: { email: docenteEmail },
  });

  if (!docenteExists) {
    const docentePassword = await bcrypt.hash('Admin123!', 10);
    await prisma.usuario.create({
      data: {
        email: docenteEmail,
        password: docentePassword,
        nombre: 'Docente Principal',
        rol: 'docente',
      },
    });
    console.log('✅ Usuario docente creado');
  } else {
    console.log('⚠️ Usuario docente ya existe, omitido');
  }

  // 🔹 Verifica si la asignatura ya existe
  const asignaturaExists = await prisma.asignatura.findFirst({
    where: { codigo: 'ASG-001' },
  });

  if (!asignaturaExists) {
    await prisma.asignatura.create({
      data: {
        nombre: 'Fundamentos de Programación',
        codigo: 'ASG-001',
      },
    });
    console.log('✅ Asignatura creada');
  } else {
    console.log('⚠️ Asignatura ya existe, omitida');
  }

  console.log('🏁 Seed ejecutado correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error al insertar los datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
