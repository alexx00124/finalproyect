// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import CarreraSelect from './pages/CarreraSelect';
import JornadaSelect from './pages/JornadaSelect';
import ModulosPage from './pages/ModulosPage';
import MateriasPage from './pages/MateriasPage';
import EvaluacionPage from './pages/EvaluacionPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/carreras" replace />} />
        <Route path="/carreras" element={<CarreraSelect />} />
        <Route path="/carreras/:carreraId/jornada" element={<JornadaSelect />} />
        <Route path="/carreras/:carreraId/jornada/:jornada/modulos" element={<ModulosPage />} />
        <Route path="/modulos/:moduloId/materias" element={<MateriasPage />} />
        <Route path="/materias/:materiaId/evaluacion" element={<EvaluacionPage />} />
      </Route>
    </Routes>
  );
}
