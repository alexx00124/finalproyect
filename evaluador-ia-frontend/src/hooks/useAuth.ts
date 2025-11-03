// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tipo de usuario que usamos en toda la app
export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'estudiante' | 'docente' | 'admin';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Al montar el hook, intentamos restaurar sesión desde localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        // Si algo está corrupto en localStorage, limpiamos sesión rota
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Llamar esto justo después de un login exitoso
  const login = (authToken: string, userData: User) => {
    // Guardar en localStorage para persistencia
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));

    // Guardar en estado React
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);

    // Redirección según el rol
    if (userData.rol === 'admin') {
        navigate('/admin');
    } else if (userData.rol === 'docente') {
        navigate('/docente');     // docente va a su panel
    } else {
        navigate('/carreras');    // estudiante al flujo normal
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };
};
