import { Test, TestingModule } from '@nestjs/testing';
import { ModulosService } from './modulos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ModulosService', () => {
  let service: ModulosService;
  let prisma: PrismaService;

  const mockPrismaService = {
    modulo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ModulosService>(ModulosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all modulos', async () => {
    const mockModulos = [
      {
        id: '1',
        nombre: 'Módulo 1',
        asignaturaId: 'asig-1',
        asignatura: { id: 'asig-1', nombre: 'Intro' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPrismaService.modulo.findMany.mockResolvedValue(mockModulos);

    const result = await service.findAll();
    
    expect(result).toEqual(mockModulos);
    expect(prisma.modulo.findMany).toHaveBeenCalledTimes(1);
  });
});