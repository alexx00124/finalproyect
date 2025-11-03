import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              access_token: 'fake-token',
              user: { id: 1, email: 'docente@admin.com', rol: 'docente' },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debería hacer login correctamente', async () => {
    const result = await controller.login({
      email: 'docente@admin.com',
      password: 'Admin123!',
    });

    expect(result).toHaveProperty('access_token');
    expect(result.user.rol).toBe('docente');
  });
});
