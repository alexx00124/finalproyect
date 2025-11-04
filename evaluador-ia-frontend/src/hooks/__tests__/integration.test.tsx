// src/__tests__/integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import { authApi } from '../../api/auth';

// Mock de authApi
jest.mock('../../api/auth');
const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

// Mock de fetch para evaluaciones
globalThis.fetch = jest.fn();

describe('Integration Tests - Flujo completo', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('Flujo completo: Login estudiante -> Navegar carreras -> Módulos', async () => {
    const user = userEvent.setup();
    
    // Mock login exitoso
    const mockResponse = {
      access_token: 'student-token',
      user: {
        id: '123',
        email: 'student@test.com',
        nombre: 'Student Test',
        rol: 'estudiante' as const
      }
    };
    mockAuthApi.login.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Verifica que inicia en login
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    // Hace login
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    await user.type(emailInput, 'student@test.com');
    await user.type(passwordInput, 'password123');
    
    const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitBtn);

    // Debe redirigir a carreras
    await waitFor(() => {
      expect(screen.getByText(/selecciona tu carrera/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Selecciona una carrera
    const ingSoftware = screen.getByRole('button', { name: /ingeniería de software/i });
    await user.click(ingSoftware);

    // Debe mostrar selección de jornada
    await waitFor(() => {
      expect(screen.getByText(/selecciona tu jornada/i)).toBeInTheDocument();
    });
  });

  test('Flujo completo: Login docente -> Panel docente', async () => {
    const user = userEvent.setup();
    
    const mockDocenteResponse = {
      access_token: 'docente-token',
      user: {
        id: '456',
        email: 'teacher@test.com',
        nombre: 'Teacher Test',
        rol: 'docente' as const
      }
    };
    mockAuthApi.login.mockResolvedValueOnce(mockDocenteResponse);

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    // Login como docente
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    await user.type(emailInput, 'teacher@test.com');
    await user.type(passwordInput, 'password123');
    
    const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitBtn);

    // Debe redirigir al panel docente
    await waitFor(() => {
      expect(screen.getByText('Panel Docente')).toBeInTheDocument();
      expect(screen.getByText('Panel del Docente')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('Flujo: Usuario no autenticado intenta acceder a ruta protegida', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Intenta navegar directamente (la app redirige al login)
    window.history.pushState({}, '', '/carreras');

    await waitFor(() => {
      // Debe estar en login porque no hay sesión
      expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
  });

  test('Flujo: Estudiante autenticado no puede acceder a rutas de docente', async () => {
    // Pre-autenticar como estudiante
    const estudianteUser = {
      id: '123',
      email: 'student@test.com',
      nombre: 'Student',
      rol: 'estudiante'
    };
    localStorage.setItem('auth_token', 'student-token');
    localStorage.setItem('auth_user', JSON.stringify(estudianteUser));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Intenta acceder a ruta docente
    window.history.pushState({}, '', '/docente');

    await waitFor(() => {
      // Debe redirigir a /carreras
      expect(screen.queryByText('Panel Docente')).not.toBeInTheDocument();
    });
  });

  test('Flujo: Logout limpia sesión y redirige a login', async () => {
    const user = userEvent.setup();
    
    // Pre-autenticar
    const estudianteUser = {
      id: '123',
      email: 'student@test.com',
      nombre: 'Student Test',
      rol: 'estudiante' as const
    };
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify(estudianteUser));

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Debe mostrar la app autenticada
    await waitFor(() => {
      expect(screen.getByText('Student Test')).toBeInTheDocument();
    });

    // Hace logout
    const logoutBtn = screen.getByRole('button', { name: /cerrar sesión/i });
    await user.click(logoutBtn);

    // Debe redirigir a login
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    // localStorage debe estar limpio
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });

  test('Flujo: Registro exitoso redirige a login', async () => {
    const user = userEvent.setup();
    
    mockAuthApi.register.mockResolvedValueOnce({
      message: 'Usuario creado',
      user: {
        id: '999',
        email: 'newuser@test.com'
      }
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navega a registro
    const registerLink = screen.getByText('Regístrate aquí');
    await user.click(registerLink);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument();
    });

    // Llena el formulario
    await user.type(screen.getByPlaceholderText('Alexander García'), 'New User');
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'newuser@test.com');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');
    
    const createBtn = screen.getByRole('button', { name: /crear cuenta/i });
    await user.click(createBtn);

    // Debe mostrar éxito y luego redirigir
    await waitFor(() => {
      expect(screen.getByText(/cuenta creada con éxito/i)).toBeInTheDocument();
    });
  });
});