import { Test, TestingModule } from '@nestjs/testing';
import { ModulosController } from './modulos.controller';
import { ModulosService } from './modulos.service';

describe('ModulosController', () => {
  let controller: ModulosController;
  let service: ModulosService;

  const mockModulosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulosController],
      providers: [
        {
          provide: ModulosService,
          useValue: mockModulosService,
        },
      ],
    }).compile();

    controller = module.get<ModulosController>(ModulosController);
    service = module.get<ModulosService>(ModulosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all modulos', async () => {
    const mockModulos = [
      {
        id: '1',
        nombre: 'Módulo 1',
        asignaturaId: 'asig-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockModulosService.findAll.mockResolvedValue(mockModulos);

    const result = await controller.findAll();
    
    expect(result).toEqual(mockModulos);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });
});