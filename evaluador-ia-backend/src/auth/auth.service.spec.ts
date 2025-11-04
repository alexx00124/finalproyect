// src/auth/auth.service.spec.ts (CORREGIDO FINAL)
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Mock de bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  // ✅ CORREGIDO: Cambiado a 'Usuario' (mayúscula) para que coincida con tu modelo Prisma
  const mockPrismaService = {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(), // ✅ Agregado signAsync
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        nombre: 'Test User',
        password: 'hashedPassword',
        rol: 'estudiante',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // ✅ Mock para verificar que el email NO existe
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);
      // ✅ Mock para crear el usuario
      mockPrismaService.usuario.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // ✅ ORDEN CORRECTO: (email, password, nombre) según auth.service.ts línea 23
      const result = await service.register(
        'test@test.com',
        'password123',
        'Test User'
      );

      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@test.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrismaService.usuario.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(mockPrismaService.usuario.create).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
      });

      await expect(
        service.register('test@test.com', 'password123', 'Test')
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login and return token', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        nombre: 'Test User',
        password: 'hashedPassword',
        rol: 'estudiante',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('fake-jwt-token');

      const result = await service.login('test@test.com', 'password123');

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('fake-jwt-token');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');

      // ✅ Ahora el payload incluye el rol
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@test.com',
        rol: 'estudiante',
      });
    });

    it('should throw error if user not found', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.login('wrong@test.com', 'password123')
      ).rejects.toThrow();
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
        rol: 'estudiante',
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('test@test.com', 'wrongpassword')
      ).rejects.toThrow();
    });
  });

  describe('additional validations', () => {
    it('should handle prisma errors gracefully', async () => {
      mockPrismaService.usuario.findUnique.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.login('test@test.com', 'password123')
      ).rejects.toThrow('Database error');
    });

    it('should hash password with correct salt rounds', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        nombre: 'Test',
        password: 'hashedPassword',
        rol: 'estudiante',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(null);
      mockPrismaService.usuario.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await service.register('test@test.com', 'password123', 'Test');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
  });
});