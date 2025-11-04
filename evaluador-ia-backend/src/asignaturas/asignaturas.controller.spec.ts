import { Test, TestingModule } from '@nestjs/testing';
import { AsignaturasController } from './asignaturas.controller';
import { AsignaturasService } from './asignaturas.service';

describe('AsignaturasController', () => {
  let controller: AsignaturasController;
  let service: AsignaturasService;

  // ✅ Mock del servicio
  const mockAsignaturasService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignaturasController],
      providers: [
        {
          provide: AsignaturasService,
          useValue: mockAsignaturasService, // ✅ Proveer el mock
        },
      ],
    }).compile();

    controller = module.get<AsignaturasController>(AsignaturasController);
    service = module.get<AsignaturasService>(AsignaturasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all asignaturas', async () => {
    const mockAsignaturas = [
      { id: '1', nombre: 'Matemáticas', createdAt: new Date(), updatedAt: new Date() },
    ];

    mockAsignaturasService.findAll.mockResolvedValue(mockAsignaturas);

    const result = await controller.findAll();
    
    expect(result).toEqual(mockAsignaturas);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });
});