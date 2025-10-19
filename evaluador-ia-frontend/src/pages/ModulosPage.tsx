import { useNavigate, useSearchParams } from 'react-router-dom';
const MODULOS = Array.from({ length: 9 }, (_, i) => i + 1);

export default function ModulosPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const carrera = params.get('carrera') ?? 'ing-software';

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Módulos — {carrera}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {MODULOS.map((m) => (
          <button
            key={m}
            onClick={() =>
              m === 1
                ? nav(`/materias?carrera=${carrera}&modulo=${m}`)
                : alert('Sólo el Módulo 1 está habilitado en el MVP')
            }
            className={`rounded-xl px-4 py-5 bg-slate-700 hover:bg-slate-600 ${m===1?'ring-2 ring-cyan-400':'opacity-60'}`}
          >
            Módulo {m}
          </button>
        ))}
      </div>
    </>
  );
}
