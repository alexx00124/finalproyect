// src/pages/EvaluacionesDocente.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarEvaluacionesIA } from '../api/ia-evaluaciones';

interface Evaluacion {
  id: string;
  titulo: string;
  createdAt: string;
  modulo: {
    id: string;
    nombre: string;
    asignatura: {
      nombre: string;
      codigo: string;
    };
  };
}

export default function EvaluacionesDocente() {
  const navigate = useNavigate();
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  const cargarEvaluaciones = async () => {
    try {
      setLoading(true);
      const data = await listarEvaluacionesIA();
      setEvaluaciones(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Evaluaciones Generadas</h1>
          <p className="text-slate-400 mt-1">Todas las evaluaciones creadas con IA</p>
        </div>
        <button
          onClick={() => navigate('/docente/generar-evaluacion')}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Evaluación
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-slate-400">Cargando evaluaciones...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950 border border-red-500 text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : evaluaciones.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">No hay evaluaciones creadas</h3>
            <p className="text-slate-400 mb-6">Crea tu primera evaluación con IA subiendo un PDF del temario</p>
            <button
              onClick={() => navigate('/docente/generar-evaluacion')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Primera Evaluación
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {evaluaciones.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-lg border border-slate-600 hover:border-cyan-500 bg-slate-700 hover:bg-slate-600 transition-all cursor-pointer group"
                onClick={() => navigate(`/materias/intro-ingenieria/evaluacion?moduloId=${ev.modulo.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {ev.titulo}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>📚 {ev.modulo.asignatura.codigo} - {ev.modulo.asignatura.nombre}</span>
                      <span className="text-slate-500">•</span>
                      <span>📖 {ev.modulo.nombre}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(ev.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
