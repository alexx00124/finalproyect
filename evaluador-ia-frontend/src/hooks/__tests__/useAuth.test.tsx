// src/hooks/__tests__/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../useAuth';
import type { User } from '../useAuth';

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test('debe inicializarse sin usuario autenticado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('debe restaurar sesión desde localStorage', () => {
    const mockUser: User = {
      id: '123',
      email: 'test@test.com',
      nombre: 'Test User',
      rol: 'estudiante'
    };
    
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('test-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('login debe guardar usuario y token - estudiante', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockUser: User = {
      id: '456',
      email: 'student@test.com',
      nombre: 'Student',
      rol: 'estudiante'
    };

    act(() => {
      result.current.login('token-123', mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('token-123');
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('auth_token')).toBe('token-123');
    expect(mockNavigate).toHaveBeenCalledWith('/carreras');
  });

  test('login debe redirigir a /docente para docentes', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockDocente: User = {
      id: '789',
      email: 'teacher@test.com',
      nombre: 'Teacher',
      rol: 'docente'
    };

    act(() => {
      result.current.login('token-docente', mockDocente);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/docente');
  });

  test('login debe redirigir a /admin para admins', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const mockAdmin: User = {
      id: '999',
      email: 'admin@test.com',
      nombre: 'Admin',
      rol: 'admin'
    };

    act(() => {
      result.current.login('token-admin', mockAdmin);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  test('logout debe limpiar sesión y redirigir a login', () => {
    const mockUser: User = {
      id: '123',
      email: 'test@test.com',
      nombre: 'Test',
      rol: 'estudiante'
    };

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login('token-123', mockUser);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('debe manejar localStorage corrupto', () => {
    localStorage.setItem('auth_token', 'token');
    localStorage.setItem('auth_user', 'invalid-json{');

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});