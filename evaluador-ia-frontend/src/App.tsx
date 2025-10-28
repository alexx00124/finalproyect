// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

// Layout estudiante
import AppLayout from './layouts/AppLayout';
// Layout docente
import TeacherLayout from './layouts/TeacherLayout';

// Páginas flujo estudiante
import CarreraSelect from './pages/CarreraSelect';
import JornadaSelect from './pages/JornadaSelect';
import ModulosPage from './pages/ModulosPage';
import MateriasPage from './pages/MateriasPage';
import EvaluacionPage from './pages/EvaluacionPage';

// Páginas auth / perfil
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Páginas docente
import DashboardDocente from './pages/DashboardDocente';
import GenerarEvaluacion from './pages/GenerarEvaluacion';
import EvaluacionesDocente from './pages/EvaluacionesDocente';

// Guards
import DocenteRoute from './components/DocenteRoute';

// Guard protegido genérico (usuario logueado)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Guard público (login/register) con redirección SEGÚN ROL
function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  const rawUser = localStorage.getItem('auth_user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (token && user) {
    // si ya estás logueado y eres docente/admin -> ve al panel docente
    if (user.rol === 'docente' || user.rol === 'admin') {
      return <Navigate to="/docente" replace />;
    }
    // si estás logueado pero eres estudiante -> ve al flujo estudiante
    return <Navigate to="/carreras" replace />;
  }

  // si no estás logueado, deja ver login/register
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
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

        {/* Estudiante: rutas bajo AppLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/carreras" element={<CarreraSelect />} />
          <Route path="/carreras/:carreraId/jornada" element={<JornadaSelect />} />
          <Route
            path="/carreras/:carreraId/jornada/:jornada/modulos"
            element={<ModulosPage />}
          />
          <Route path="/modulos/:moduloId/materias" element={<MateriasPage />} />
          <Route path="/materias/:materiaId/evaluacion" element={<EvaluacionPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Docente: rutas bajo TeacherLayout */}
        <Route
          path="/docente"
          element={
            <DocenteRoute>
              <TeacherLayout />
            </DocenteRoute>
          }
        >
          <Route index element={<DashboardDocente />} />
          <Route path="generar" element={<GenerarEvaluacion />} />
          <Route path="evaluaciones" element={<EvaluacionesDocente />} />
        </Route>

        {/* Legacy & fallback */}
        <Route path="/dashboard" element={<Navigate to="/carreras" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
