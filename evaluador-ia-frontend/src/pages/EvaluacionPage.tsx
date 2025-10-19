import { useSearchParams } from 'react-router-dom';

export default function EvaluacionPage() {
  const [params] = useSearchParams();
  const carrera = params.get('carrera');
  const modulo = params.get('modulo');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Evaluación — Programación 1</h2>
      <p className="opacity-80 text-sm">Carrera: {carrera} — Módulo: {modulo}</p>

      <div className="space-y-3">
        <label className="block">
          <span className="text-sm opacity-90">Código del estudiante</span>
          <input className="mt-1 w-full rounded-lg bg-slate-700 px-3 py-2 outline-none" />
        </label>
        <label className="block">
          <span className="text-sm opacity-90">Respuesta (ensayo corto)</span>
          <textarea rows={6} className="mt-1 w-full rounded-lg bg-slate-700 px-3 py-2 outline-none" />
        </label>
        <button className="rounded-xl bg-cyan-400 text-black px-4 py-2 font-semibold hover:opacity-90">
          Enviar (MVP sin backend)
        </button>
      </div>
    </div>
  );
}
