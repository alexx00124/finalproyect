// src/pages/GenerarEvaluacion.tsx
import { useState, useRef } from "react";

export default function GenerarEvaluacion() {
  // estado para guardar el pdf seleccionado
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // url temporal para previsualizar el pdf
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // referencia al <input type="file" /> oculto
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handlePickFile() {
    // abrir selector de archivos
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // validación rápida: solo PDF
    if (file.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF 🙏");
      return;
    }

    // guardar archivo en estado
    setPdfFile(file);

    // crear URL blob temporal para preview
    const url = URL.createObjectURL(file);
    setPdfPreviewUrl(url);
  }

  function handleGenerar() {
    // aquí vamos a armar el FormData y llamar al backend
    // por ahora no hacemos nada (y NO mostramos console.log)
    if (!pdfFile) return;
  }

  return (
    <div className="text-slate-100">
      {/* Título */}
      <h1 className="text-xl font-bold text-cyan-400 mb-4">
        Generar evaluación con IA
      </h1>

      {/* Descripción */}
      <p className="text-slate-400 text-sm mb-6">
        Sube tu PDF. La IA leerá el contenido y propondrá preguntas de
        selección múltiple.
      </p>

      {/* Card principal */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 space-y-4 shadow-[0_30px_120px_-15px_rgba(0,0,0,0.8)]">
        {/* Zona de subida */}
        <div
          className="
            flex flex-col items-center justify-center gap-3
            rounded-lg border border-dashed border-slate-600
            bg-slate-800/30 px-4 py-8 text-center cursor-pointer
            hover:bg-slate-800/50 hover:border-cyan-400/50 transition
          "
          onClick={handlePickFile}
        >
          <div className="text-cyan-400 text-lg">📄</div>

          <div className="flex flex-col">
            <span className="text-slate-200 text-sm font-medium">
              {pdfFile ? "PDF seleccionado" : "Haz clic para seleccionar tu PDF"}
            </span>
            <span className="text-slate-500 text-xs">
              {pdfFile ? pdfFile.name : "o arrástralo aquí (máx 10MB)"}
            </span>
          </div>

          {/* Botón visible */}
          <button
            type="button"
            onClick={handlePickFile}
            className="
              mt-3 rounded-md bg-cyan-500/20 px-3 py-1.5
              text-cyan-400 text-xs font-semibold
              border border-cyan-500/40 hover:bg-cyan-500/30
              transition
            "
          >
            Seleccionar PDF
          </button>

          {/* input REAL pero oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview del PDF si ya hay archivo */}
        {pdfPreviewUrl && (
          <div className="mt-4">
            <p className="text-slate-300 text-sm font-semibold mb-2">
              Vista previa:
            </p>

            <div className="rounded-lg border border-slate-700 bg-slate-950/40 overflow-hidden">
              {/* iframe para ver el PDF */}
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-[400px] bg-slate-900"
                title="Vista previa PDF"
              />
            </div>
          </div>
        )}

        {/* Botón para "Generar evaluación" */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled={!pdfFile}
            className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${
              pdfFile
                ? "bg-green-600 text-white hover:bg-green-500"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
            onClick={handleGenerar}
          >
            Generar preguntas con IA
          </button>
        </div>
      </div>
    </div>
  );
}
