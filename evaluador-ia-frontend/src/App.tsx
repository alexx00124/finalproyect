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
import Dashboard from './pages/Dashboard';

// 🔒 Ruta protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas (requieren token) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Rutas del flujo principal (evaluador) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/carreras" replace />} />
          <Route path="/carreras" element={<CarreraSelect />} />
          <Route path="/carreras/:carreraId/jornada" element={<JornadaSelect />} />
          <Route path="/carreras/:carreraId/jornada/:jornada/modulos" element={<ModulosPage />} />
          <Route path="/modulos/:moduloId/materias" element={<MateriasPage />} />
          <Route path="/materias/:materiaId/evaluacion" element={<EvaluacionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
