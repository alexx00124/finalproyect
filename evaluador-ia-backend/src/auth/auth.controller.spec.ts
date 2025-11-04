import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const mockResponse = {
      message: 'Usuario creado exitosamente',
      user: {
        id: '1',
        email: 'test@test.com',
      },
    };

    mockAuthService.register.mockResolvedValue(mockResponse);

    const result = await controller.register({
      email: 'test@test.com',
      nombre: 'Test',
      password: 'password123',
    });

    expect(result).toEqual(mockResponse);
    expect(service.register).toHaveBeenCalledTimes(1);
  });

  it('should login a user', async () => {
    const mockResponse = {
      access_token: 'fake-token',
      user: {
        id: '1',
        email: 'test@test.com',
        nombre: 'Test',
      },
    };

    mockAuthService.login.mockResolvedValue(mockResponse);

    const result = await controller.login({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result).toEqual(mockResponse);
    expect(service.login).toHaveBeenCalledTimes(1);
  });
});