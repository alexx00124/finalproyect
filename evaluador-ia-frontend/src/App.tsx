// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

// 📦 Layout y páginas principales
import AppLayout from './layouts/AppLayout';
import TeacherLayout from './layouts/TeacherLayout';

// 🔐 Páginas de autenticación
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// 🚸 Páginas flujo estudiante
import CarreraSelect from './pages/CarreraSelect';
import JornadaSelect from './pages/JornadaSelect';
import ModulosPage from './pages/ModulosPage';
import MateriasPage from './pages/MateriasPage';
import EvaluacionPage from './pages/EvaluacionPage';

// 🎓 Páginas de docente
import DashboardDocente from './pages/DashboardDocente';
import GenerarEvaluacion from './pages/GenerarEvaluacion';
import EvaluacionesDocente from './pages/EvaluacionesDocente';

// 🛡️ Componentes de protección
import DocenteRoute from './components/DocenteRoute';

/* ============================================================
   🔒 RUTA PROTEGIDA — Solo accesible si hay token válido
============================================================ */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

/* ============================================================
   🔓 RUTA PÚBLICA — Si ya está logueado, redirige según rol
============================================================ */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token');
  const rawUser = localStorage.getItem('auth_user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (token && user) {
    // Si ya estás logueado y eres docente/admin -> panel docente
    if (user.rol === 'docente' || user.rol === 'admin') {
      return <Navigate to="/docente" replace />;
    }
    // Si estás logueado pero eres estudiante -> flujo estudiante
    return <Navigate to="/carreras" replace />;
  }

  // Si no estás logueado, deja ver login/register
  return <>{children}</>;
}

/* ============================================================
   🚀 APP PRINCIPAL
============================================================ */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 RUTAS PÚBLICAS */}
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

        {/* 🧭 RUTAS PROTEGIDAS - ESTUDIANTE */}
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

        {/* 🎓 RUTAS PROTEGIDAS - DOCENTE */}
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

        {/* 🔄 REDIRECCIONES Y FALLBACK */}
        <Route path="/dashboard" element={<Navigate to="/carreras" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}