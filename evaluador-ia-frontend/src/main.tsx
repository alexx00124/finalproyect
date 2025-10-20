import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import AppLayout from './layouts/AppLayout';
import CarreraSelect from './pages/CarreraSelect';
import JornadaSelect from './pages/JornadaSelect';
import ModulosPage from './pages/ModulosPage';
import MateriasPage from './pages/MateriasPage';
import EvaluacionPage from './pages/EvaluacionPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <CarreraSelect /> }, // 1) Carrera
      { path: 'carreras/:carreraId/jornada', element: <JornadaSelect /> }, // 2) Jornada
      { path: 'carreras/:carreraId/jornada/:jornada/modulos', element: <ModulosPage /> }, // 3) Módulos
      { path: 'modulos/:moduloId/materias', element: <MateriasPage /> }, // 4) Materias (de un módulo)
      { path: 'materias/:materiaId/evaluacion', element: <EvaluacionPage /> }, // 5) Evaluación
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
