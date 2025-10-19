import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import AppLayout from './layouts/AppLayout';
import CarreraSelect from './pages/CarreraSelect';
import ModulosPage from './pages/ModulosPage';
import MateriasPage from './pages/MateriasPage';
import EvaluacionPage from './pages/EvaluacionPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <CarreraSelect /> },
      { path: 'modulos', element: <ModulosPage /> },
      { path: 'materias', element: <MateriasPage /> },
      { path: 'evaluacion', element: <EvaluacionPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
