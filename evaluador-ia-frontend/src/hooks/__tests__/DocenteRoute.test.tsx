// src/components/__tests__/DocenteRoute.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocenteRoute from '../../components/DocenteRoute';

const TestComponent = () => <div>Contenido Docente</div>;
const LoginComponent = () => <div>Login Page</div>;
const CarrerasComponent = () => <div>Carreras Page</div>;

const renderWithRouter = (initialPath = '/docente') => {
  window.history.pushState({}, 'Test', initialPath);
  
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/carreras" element={<CarrerasComponent />} />
        <Route
          path="/docente"
          element={
            <DocenteRoute>
              <TestComponent />
            </DocenteRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

describe('DocenteRoute Guard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('debe redirigir a /login si no hay token', () => {
    renderWithRouter();
    
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Docente')).not.toBeInTheDocument();
  });

  test('debe redirigir a /login si no hay usuario', () => {
    localStorage.setItem('auth_token', 'test-token');
    
    renderWithRouter();
    
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('debe redirigir a /login si usuario está corrupto', () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', 'invalid-json{');
    
    renderWithRouter();
    
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('debe redirigir a /carreras si usuario es estudiante', () => {
    const estudianteUser = {
      id: '123',
      email: 'student@test.com',
      nombre: 'Student',
      rol: 'estudiante'
    };
    
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify(estudianteUser));
    
    renderWithRouter();
    
    expect(screen.getByText('Carreras Page')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Docente')).not.toBeInTheDocument();
  });

  test('debe permitir acceso si usuario es docente', () => {
    const docenteUser = {
      id: '456',
      email: 'teacher@test.com',
      nombre: 'Teacher',
      rol: 'docente'
    };
    
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify(docenteUser));
    
    renderWithRouter();
    
    expect(screen.getByText('Contenido Docente')).toBeInTheDocument();
  });

  test('debe permitir acceso si usuario es admin', () => {
    const adminUser = {
      id: '789',
      email: 'admin@test.com',
      nombre: 'Admin',
      rol: 'admin'
    };
    
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify(adminUser));
    
    renderWithRouter();
    
    expect(screen.getByText('Contenido Docente')).toBeInTheDocument();
  });
});