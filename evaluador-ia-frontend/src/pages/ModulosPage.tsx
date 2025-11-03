// src/pages/ModulosPage.tsx
import { useNavigate, useParams } from 'react-router-dom';
const MODULOS = Array.from({ length: 9 }, (_, i) => i + 1);

export default function ModulosPage() {
  const nav = useNavigate();
  const { carreraId, jornada } = useParams();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">
        Módulos — {carreraId} ({jornada})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {MODULOS.map((m) => (
          <button
            key={m}
            onClick={() =>
              m === 1
                ? nav(`/modulos/${m}/materias?carrera=${carreraId}&jornada=${jornada}`)
                : alert('Sólo el Módulo 1 está habilitado en el MVP')
            }
            className={`rounded-xl px-4 py-5 bg-slate-700 hover:bg-slate-600 ${
              m === 1 ? 'ring-2 ring-cyan-400' : 'opacity-60'
            }`}
          >
            Módulo {m}
          </button>
        ))}
      </div>
    </div>
  );
}
