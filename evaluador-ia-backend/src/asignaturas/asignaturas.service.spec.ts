import { Test, TestingModule } from '@nestjs/testing';
import { AsignaturasService } from './asignaturas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AsignaturasService', () => {
  let service: AsignaturasService;
  let prisma: PrismaService;

  // ✅ Mock de PrismaService
  const mockPrismaService = {
    asignatura: {
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
        AsignaturasService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // ✅ Proveer el mock
        },
      ],
    }).compile();

    service = module.get<AsignaturasService>(AsignaturasService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all asignaturas', async () => {
    const mockAsignaturas = [
      { id: '1', nombre: 'Matemáticas', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', nombre: 'Física', createdAt: new Date(), updatedAt: new Date() },
    ];

    mockPrismaService.asignatura.findMany.mockResolvedValue(mockAsignaturas);

    const result = await service.findAll();
    
    expect(result).toEqual(mockAsignaturas);
    expect(prisma.asignatura.findMany).toHaveBeenCalledTimes(1);
  });
});