// src/pages/CarreraSelect.tsx
import { useNavigate } from 'react-router-dom';

export default function CarreraSelect() {
  const nav = useNavigate();
  const go = (carreraId: 'ing-software' | 'ing-sistemas') => {
    nav(`/carreras/${carreraId}/jornada`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Selecciona tu carrera</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => go('ing-software')}
          className="rounded-xl bg-cyan-400 text-black px-4 py-6 font-semibold hover:opacity-90"
        >
          Ingeniería de Software
        </button>
        <button
          onClick={() => go('ing-sistemas')}
          className="rounded-xl bg-lime-500 text-black px-4 py-6 font-semibold hover:opacity-90"
        >
          Ingeniería de Sistemas
        </button>
      </div>
      <p className="text-sm opacity-80">
        MVP activo: <b>Ing. de Software → Jornada → Módulo 1 → Introducción a la Ingeniería</b>.
      </p>
    </div>
  );
}
