// src/pages/MateriasPage.tsx
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const MATERIAS_M1_SOFT = [
  'Programación 1',
  'Introducción a la Ingeniería de Software', // <-- ÚNICA habilitada en el MVP
  'Matemáticas Discretas',
  'Lógica',
  'Fundamentos de Computación',
  'Comunicación',
];

export default function MateriasPage() {
  const nav = useNavigate();
  const { moduloId } = useParams(); // viene de /modulos/:moduloId/materias
  const [params] = useSearchParams(); // preservamos carrera y jornada que vienen como query
  const carrera = params.get('carrera') ?? 'ing-software';
  const jornada = params.get('jornada') ?? 'diurna';

  const goEvaluacion = () => {
    // materiaId slug para la ruta
    const materiaId = 'intro-ingenieria';
    nav(`/materias/${materiaId}/evaluacion?carrera=${carrera}&jornada=${jornada}&modulo=${moduloId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Materias — {carrera} / {jornada} / Módulo {moduloId}
      </h2>

      <ul className="space-y-2">
        {MATERIAS_M1_SOFT.map((mat) => {
          const habilitada = mat === 'Introducción a la Ingeniería de Software';
          return (
            <li key={mat}>
              <button
                onClick={() => (habilitada ? goEvaluacion() : alert('En el MVP solo funciona "Introducción a la Ingeniería de Software".'))}
                className={`w-full text-left rounded-xl px-4 py-3 bg-slate-700 hover:bg-slate-600 ${
                  habilitada ? 'ring-2 ring-cyan-400' : 'opacity-60'
                }`}
              >
                {mat}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
