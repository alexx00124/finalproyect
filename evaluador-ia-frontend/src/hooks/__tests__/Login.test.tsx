// src/pages/__tests__/Login.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { authApi } from '../../api/auth';

// Mock de authApi
jest.mock('../../api/auth');
const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

// Mock de useAuth
const mockLogin = jest.fn();
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    token: null,
    isAuthenticated: false,
    logout: jest.fn(),
  }),
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar el formulario de login', () => {
    renderLogin();
    
    // Usa getByRole para el heading - más específico
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('debe mostrar errores de validación con campos vacíos', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    await waitFor(() => {
      // Busca de forma más flexible por si el texto varía
      const errorMessage = screen.queryByText(/correo.*inválido/i) || 
                          screen.queryByText(/email.*requerido/i) ||
                          screen.queryByText(/campo.*requerido/i);
      expect(errorMessage).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('debe validar email inválido', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    await waitFor(() => {
      // Busca el mensaje de error de forma más flexible
      const errorMessage = screen.queryByText(/correo.*inválido/i) || 
                          screen.queryByText(/email.*inválido/i) ||
                          screen.queryByText(/formato.*email/i);
      expect(errorMessage).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('debe validar contraseña corta', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, '12345');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/la contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('debe hacer login exitoso', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      access_token: 'test-token',
      user: {
        id: '123',
        email: 'test@test.com',
        nombre: 'Test User',
        rol: 'estudiante' as const
      }
    };

    mockAuthApi.login.mockResolvedValueOnce(mockResponse);
    
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuthApi.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      });
      expect(mockLogin).toHaveBeenCalledWith('test-token', mockResponse.user);
    }, { timeout: 3000 });
  });

  test('debe mostrar error al fallar login', async () => {
    const user = userEvent.setup();
    
    mockAuthApi.login.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Credenciales inválidas'
        }
      }
    });
    
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    await user.type(emailInput, 'wrong@test.com');
    await user.type(passwordInput, 'wrongpassword');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('debe mostrar loading durante el submit', async () => {
    const user = userEvent.setup();
    
    mockAuthApi.login.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('debe tener link a registro', () => {
    renderLogin();
    
    const registerLink = screen.getByText('Regístrate aquí');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
});