import { Test, TestingModule } from '@nestjs/testing';
import { ModulosController } from './modulos.controller';
import { ModulosService } from './modulos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ModulosController', () => {
  let controller: ModulosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulosController],
      providers: [
        ModulosService,
        {
          provide: PrismaService,
          useValue: {
            // Aquí puedes agregar mocks si los necesitas
            modulo: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<ModulosController>(ModulosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
