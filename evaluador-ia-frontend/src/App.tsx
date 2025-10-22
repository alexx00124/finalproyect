// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout y páginas principales
import AppLayout from './layouts/AppLayout';
import CarreraSelect from './pages/CarreraSelect';
import JornadaSelect from './pages/JornadaSelect';
import ModulosPage from './pages/ModulosPage';
import MateriasPage from './pages/MateriasPage';
import EvaluacionPage from './pages/EvaluacionPage';

// Páginas de autenticación
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// 🔒 Ruta protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// 🔓 Ruta pública (si ya está logueado, redirige a carreras)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return <Navigate to="/carreras" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (si ya está logueado, redirige) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Redirección temporal por si alguien intenta ir a /dashboard */}
        <Route path="/dashboard" element={<Navigate to="/carreras" replace />} />

        {/* Rutas protegidas dentro del AppLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Flujo principal */}
          <Route path="/carreras" element={<CarreraSelect />} />
          <Route path="/carreras/:carreraId/jornada" element={<JornadaSelect />} />
          <Route path="/carreras/:carreraId/jornada/:jornada/modulos" element={<ModulosPage />} />
          <Route path="/modulos/:moduloId/materias" element={<MateriasPage />} />
          <Route path="/materias/:materiaId/evaluacion" element={<EvaluacionPage />} />
          
          {/* Perfil de usuario */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}