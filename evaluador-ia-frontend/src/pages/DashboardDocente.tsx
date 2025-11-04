// src/pages/DashboardDocente.tsx
export default function DashboardDocente() {
  return (
    <div className="text-slate-100">
      <h1 className="text-2xl font-bold text-cyan-400 mb-2">
        Panel del Docente
      </h1>

      <p className="text-slate-300 text-sm mb-6">
        Aquí puedes generar nuevas evaluaciones con IA,
        revisar las que ya guardaste y administrar tus módulos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Generar evaluación */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <h2 className="text-lg font-semibold text-white mb-1">
            📄 Generar nueva evaluación
          </h2>
          <p className="text-slate-400 text-sm mb-3">
            Sube un PDF y deja que la IA cree preguntas.
          </p>
          <a
            href="/docente/generar"
            className="inline-block bg-cyan-500 text-slate-900 font-semibold rounded-lg px-4 py-2 hover:bg-cyan-400 transition"
          >
            Generar con IA
          </a>
        </div>

        {/* Card: Evaluaciones guardadas */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <h2 className="text-lg font-semibold text-white mb-1">
            📚 Evaluaciones guardadas
          </h2>
          <p className="text-slate-400 text-sm mb-3">
            Consulta el banco de evaluaciones ya creadas.
          </p>
          <a
            href="/docente/evaluaciones"
            className="inline-block bg-slate-700 text-white font-semibold rounded-lg px-4 py-2 hover:bg-slate-600 transition border border-slate-600"
          >
            Ver evaluaciones
          </a>
        </div>
      </div>
    </div>
  );
}
 