// src/pages/GenerarEvaluacion.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuesta_correcta: string;
  explicacion: string;
}

interface EvaluacionGenerada {
  titulo: string;
  preguntas: Pregunta[];
}

export default function GenerarEvaluacion() {
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [moduloId, setModuloId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [evaluacionGenerada, setEvaluacionGenerada] = useState<EvaluacionGenerada | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Solo se permiten archivos PDF');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo no debe superar los 10MB');
        return;
      }
      setPdfFile(file);
      setError('');
    }
  };

  const handleGenerar = async () => {
    if (!pdfFile) {
      setError('Debes seleccionar un archivo PDF');
      return;
    }

    if (!moduloId.trim()) {
      setError('Debes ingresar el ID del módulo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('moduloId', moduloId.trim());

      const token = localStorage.getItem('auth_token');

      const response = await fetch('http://localhost:3000/ia-evaluaciones/generar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al generar la evaluación');
      }

      const data = await response.json();
      setEvaluacionGenerada(data.data);
      console.log('✅ Evaluación generada:', data);
    } catch (err: any) {
      setError(err.message || 'Error al generar la evaluación');
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!evaluacionGenerada) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch('http://localhost:3000/ia-evaluaciones/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: evaluacionGenerada.titulo,
          preguntas: evaluacionGenerada.preguntas,
          moduloId: moduloId.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la evaluación');
      }

      const data = await response.json();
      alert('✅ Evaluación guardada exitosamente');
      console.log('✅ Evaluación guardada:', data);

      // Resetear formulario
      setPdfFile(null);
      setModuloId('');
      setEvaluacionGenerada(null);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la evaluación');
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/carreras')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          <h1 className="text-4xl font-bold text-gray-800">🎓 Generar Evaluación con IA</h1>
          <p className="text-gray-600 mt-2">
            Sube un PDF del temario y la IA generará 5 preguntas automáticamente
          </p>
        </div>

        {/* Formulario de carga */}
        {!evaluacionGenerada && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="space-y-6">
              {/* Upload PDF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 Archivo PDF del temario
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 cursor-pointer"
                />
                {pdfFile && (
                  <p className="mt-2 text-sm text-green-600">✅ {pdfFile.name}</p>
                )}
              </div>

              {/* Módulo ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔑 ID del Módulo
                </label>
                <input
                  type="text"
                  value={moduloId}
                  onChange={(e) => setModuloId(e.target.value)}
                  placeholder="Ej: cmgxceavq0001covk7jg9hgu"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Puedes obtenerlo desde Prisma Studio o la base de datos
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  ⚠️ {error}
                </div>
              )}

              {/* Botón generar */}
              <button
                onClick={handleGenerar}
                disabled={loading || !pdfFile || !moduloId}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg
                  font-semibold hover:bg-indigo-700 disabled:opacity-50 
                  disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '🤖 Generando preguntas...' : '✨ Generar Evaluación'}
              </button>
            </div>
          </div>
        )}

        {/* Resultados */}
        {evaluacionGenerada && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📝 {evaluacionGenerada.titulo}
            </h2>

            <div className="space-y-6">
              {evaluacionGenerada.preguntas.map((pregunta, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {index + 1}. {pregunta.pregunta}
                  </h3>

                  <div className="space-y-2 mb-3">
                    {pregunta.opciones.map((opcion, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded ${
                          opcion === pregunta.respuesta_correcta
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        {opcion}
                        {opcion === pregunta.respuesta_correcta && (
                          <span className="ml-2 text-green-600 font-bold">✓</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-3 rounded text-sm text-gray-700">
                    💡 <strong>Explicación:</strong> {pregunta.explicacion}
                  </div>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleGuardar}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg
                  font-semibold hover:bg-green-700 disabled:opacity-50 
                  transition-colors"
              >
                {loading ? 'Guardando...' : '💾 Guardar Evaluación'}
              </button>

              <button
                onClick={() => {
                  setEvaluacionGenerada(null);
                  setPdfFile(null);
                  setModuloId('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg
                  font-semibold hover:bg-gray-300 transition-colors"
              >
                🔄 Generar otra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}