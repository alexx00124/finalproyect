import { useNavigate, useSearchParams } from 'react-router-dom';

const MATERIAS_M1_SOFT = [
  'Programación 1', // habilitada
  'Introducción a la Ingeniería de Software',
  'Matemáticas Discretas',
  'Lógica',
  'Fundamentos de Computación',
  'Comunicación'
];

export default function MateriasPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const carrera = params.get('carrera') ?? 'ing-software';
  const modulo = params.get('modulo') ?? '1';

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Materias — {carrera} / Módulo {modulo}</h2>
      <ul className="space-y-2">
        {MATERIAS_M1_SOFT.map((mat, idx) => {
          const habilitada = idx === 0;
          return (
            <li key={mat}>
              <button
                onClick={() =>
                  habilitada
                    ? nav(`/evaluacion?carrera=${carrera}&modulo=${modulo}&materia=programacion-1`)
                    : alert('En el MVP sólo funciona "Programación 1".')
                }
                className={`w-full text-left rounded-xl px-4 py-3 bg-slate-700 hover:bg-slate-600 ${habilitada?'ring-2 ring-cyan-400':'opacity-60'}`}
              >
                {mat}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
