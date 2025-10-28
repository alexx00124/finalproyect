// src/pages/GenerarEvaluacion.tsx

export default function GenerarEvaluacion() {
  return (
    <div className="text-slate-100">
      <h1 className="text-xl font-bold text-cyan-400 mb-4">
        Generar evaluación con IA
      </h1>

      <p className="text-slate-400 text-sm mb-6">
        Sube tu PDF. La IA leerá el contenido y propondrá preguntas de selección múltiple.
      </p>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <p className="text-slate-400 text-sm">
          🔜 Aquí va el drag & drop / input file para subir PDF.
        </p>
      </div>
    </div>
  );
}
