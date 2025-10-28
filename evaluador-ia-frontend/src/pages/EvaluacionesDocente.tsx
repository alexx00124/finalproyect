// src/pages/EvaluacionesDocente.tsx

export default function EvaluacionesDocente() {
  return (
    <div className="text-slate-100">
      <h1 className="text-xl font-bold text-cyan-400 mb-4">
        Mis evaluaciones guardadas
      </h1>

      <p className="text-slate-400 text-sm mb-6">
        Aquí verás todas las evaluaciones generadas y guardadas para tus módulos.
      </p>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-slate-400 text-sm">
        🔜 Aquí vamos a listar desde BD las evaluaciones (fase 3).
      </div>
    </div>
  );
}
