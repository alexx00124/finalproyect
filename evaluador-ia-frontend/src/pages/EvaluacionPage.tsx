// src/pages/EvaluacionPage.tsx
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

interface Opcion {
  letra: "A" | "B" | "C" | "D";
  texto: string;
}
interface Pregunta {
  numero: number;
  enunciado: string;
  opciones: Opcion[];
  correcta?: "A" | "B" | "C" | "D";
}

const MODULO1_ID = "cmgxianty0000com411pgo2qp";

export default function EvaluacionPage() {
  const [params] = useSearchParams();
  const carrera = params.get("carrera") ?? "ing-software";
  const jornada = params.get("jornada") ?? "diurna";
  const modulo = params.get("modulo") ?? "1";
  const moduloIdFromUrl = params.get("moduloId") ?? undefined;

  const [codigo, setCodigo] = useState("");
  const [evaluacion, setEvaluacion] = useState<any>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<
    Record<number, "A" | "B" | "C" | "D" | undefined>
  >({});
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<any>(null);

  const [idx, setIdx] = useState(0);
  const total = preguntas.length;
  const actual = useMemo(() => preguntas[idx], [preguntas, idx]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

    async function fetchJson(url: string) {
      const r = await fetch(url);
      if (!r.ok) return null;
      try {
        return await r.json();
      } catch {
        return null;
      }
    }

    function toArray(data: any): any[] {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.items)) return data.items;
      return [];
    }

    // ---------- Helpers ----------
    function extractPreguntas(item: any): any[] | null {
      if (!item) return null;

      // en el propio item
      if (Array.isArray(item?.preguntas)) return item.preguntas;
      if (Array.isArray(item?.cuestionario?.preguntas))
        return item.cuestionario.preguntas;
      if (Array.isArray(item?.estructura?.preguntas))
        return item.estructura.preguntas;

      // debajo de "contenido"
      const c = item?.contenido;

      if (Array.isArray(c)) return c;

      if (Array.isArray(c?.preguntas)) return c.preguntas;
      if (Array.isArray(c?.data?.preguntas)) return c.data.preguntas;
      if (Array.isArray(c?.cuestionario?.preguntas))
        return c.cuestionario.preguntas;
      if (Array.isArray(c?.estructura?.preguntas)) return c.estructura.preguntas;

      if (Array.isArray(c?.items)) return c.items;

      return null;
    }

    function pickEvaluacion(items: any[]): any | null {
      if (!Array.isArray(items) || !items.length) return null;

      // ya trae preguntas
      const withQs = items.find((e) => {
        const qs = extractPreguntas(e);
        return Array.isArray(qs) && qs.length > 0;
      });
      if (withQs) return withQs;

      // contenido objeto con preguntas en subrutas
      const withContentArray = items.find((e) => {
        const c = e?.contenido;
        if (!c || typeof c !== "object") return false;
        return (
          Array.isArray(c.preguntas) ||
          Array.isArray(c?.data?.preguntas) ||
          Array.isArray(c?.cuestionario?.preguntas) ||
          Array.isArray(c?.estructura?.preguntas)
        );
      });
      if (withContentArray) return withContentArray;

      // contenido string no vacío
      const withText = items.find(
        (e) => typeof e?.contenido === "string" && e.contenido.trim().length
      );
      if (withText) return withText;

      // fallback: primero
      return items[0];
    }

    // --------- PARSER ROBUSTO (maneja texto en una sola línea) ---------
    function parseDesdeTexto(raw: string): Pregunta[] {
      // Normaliza saltos, elimina BOM
      let texto = String(raw).replace(/\r\n/g, "\n").replace(/\uFEFF/g, "").trim();

      // Elimina encabezados aunque estén pegados al resto
      texto = texto
        .replace(/Tipo(?:\s*de\s*evaluaci[oó]n)?\s*:\s.*?(?=(\d|\n|$))/gims, "")
        .replace(/Instrucciones\s*:\s.*?(?=(\d|\n|$))/gims, "")
        .trim();

      // Convierte emojis keycap 1️⃣ 2️⃣ ... a "1. " "2. " ...
      texto = texto.replace(/([0-9])\uFE0F?\u20E3/g, "$1. ");

      // Inserta saltos aunque venga todo corrido:
      // - antes de número de pregunta
      // - antes de cada opción A/B/C/D
      // - antes de "Respuesta correcta"
      texto = texto
        .replace(/(?:\s*)(\d+)\s*(?:[.)\-–])\s+/g, "\n$1. ")
        .replace(/(?:\s*)([A-D])\s*(?:[).\-–])\s+/g, "\n$1) ")
        .replace(/(?:\s*)(✅\s*)?Respuesta\s*correcta\s*:/gi, "\n$1Respuesta correcta: ")
        .trim();

      // Regex de preguntas
      const rePregunta =
        /(?:^|\n)(\d+)\s*(?:[.)\-–])?\s+([\s\S]*?)(?=(?:\n\d+\s*(?:[.)\-–])?\s+)|$)/g;

      const out: Pregunta[] = [];
      let m: RegExpExecArray | null;

      while ((m = rePregunta.exec(texto)) !== null) {
        const numero = parseInt(m[1], 10);
        const bloque = m[2].trim();

        // Opciones
        const reOpcion =
          /(?:^|\n)\s*([A-D])\s*(?:[).\-–])\s+([\s\S]*?)(?=(?:\n\s*[A-D]\s*(?:[).\-–])\s+)|$)/g;

        const opciones: Opcion[] = [];
        let mo: RegExpExecArray | null;

        while ((mo = reOpcion.exec(bloque)) !== null) {
          const letra = mo[1] as Opcion["letra"];
          const textoOpt = mo[2].trim();
          if (!textoOpt || /^respuesta\s*correcta/i.test(textoOpt)) continue;
          opciones.push({ letra, texto: textoOpt });
        }

        const enunciado = bloque.split(/\n\s*[A-D]\s*(?:[).\-–])\s+/)[0].trim();

        // Acepta "✅ Respuesta correcta: X" o sin emoji
        const mCorr = bloque.match(/(?:✅\s*)?Respuesta\s*correcta\s*:\s*([A-D])/i);
        const correcta: "A" | "B" | "C" | "D" | undefined = mCorr
          ? (mCorr[1] as "A" | "B" | "C" | "D")
          : undefined;

        if (enunciado && opciones.length) out.push({ numero, enunciado, opciones, correcta });
      }

      return out.sort((a, b) => a.numero - b.numero);
    }
    // -------------------------------------------------------------------

    function parseDesdeJsonFlexible(pregs: any[]): Pregunta[] {
      const ABCD = ["A", "B", "C", "D"] as const;
      return pregs
        .map((p, i) => {
          const numero = Number(p.numero ?? p.id ?? i + 1);
          const enunciado = String(
            p.enunciado ?? p.pregunta ?? p.texto ?? ""
          ).trim();

          const rawOpts = Array.isArray(p.opciones)
            ? p.opciones
            : Array.isArray(p.options)
            ? p.options
            : [];

          const opciones: Opcion[] = rawOpts
            .map((o: any, j: number) => {
              const letra = (o.key ??
                o.letra ??
                o.opcion ??
                o.value ??
                ABCD[j]) as Opcion["letra"];
              const texto = String(
                o.texto ?? o.label ?? o.descripcion ?? o.desc ?? ""
              ).trim();
              return { letra, texto };
            })
            .filter((o: Opcion) => o.texto);

          const correcta = (p.correcta ?? p.respuesta ?? p.answer) as
            | "A"
            | "B"
            | "C"
            | "D"
            | undefined;

          return { numero, enunciado, opciones, correcta };
        })
        .filter((p) => p.enunciado && p.opciones?.length);
    }

    const loadEvaluacion = async () => {
      setLoading(true);
      try {
        const ids = [moduloIdFromUrl, MODULO1_ID].filter(Boolean) as string[];
        let ev: any = null;
        let arr: any[] = [];

        // 1) intenta por moduloId
        for (const id of ids) {
          const url = `${API}/evaluaciones?moduloId=${encodeURIComponent(id)}`;
          const json = await fetchJson(url);
          arr = toArray(json);
          if (arr.length) {
            ev = pickEvaluacion(arr);
            if (ev) break;
          }
        }

        // 2) si no hay nada, trae todas
        if (!ev) {
          const urlAll = `${API}/evaluaciones`;
          const json = await fetchJson(urlAll);
          arr = toArray(json);
          ev = pickEvaluacion(arr);
        }

        if (!ev) {
          setEvaluacion(null);
          setPreguntas([]);
          return;
        }

        setEvaluacion(ev);

        // ---------- parseo flexible ----------
        const preguntasCrudas = extractPreguntas(ev);
        let parsed: Pregunta[] = [];

        if (Array.isArray(preguntasCrudas) && preguntasCrudas.length) {
          parsed = parseDesdeJsonFlexible(preguntasCrudas);
        } else if (ev?.contenido && typeof ev.contenido === "string") {
          const txt = ev.contenido.trim();
          if (txt.startsWith("[") || txt.startsWith("{")) {
            try {
              const maybe = JSON.parse(txt);
              if (Array.isArray(maybe)) {
                parsed = parseDesdeJsonFlexible(maybe);
              } else {
                const cand =
                  maybe?.preguntas ??
                  maybe?.data?.preguntas ??
                  maybe?.cuestionario?.preguntas ??
                  maybe?.estructura?.preguntas ??
                  maybe?.items ??
                  null;

                parsed = Array.isArray(cand)
                  ? parseDesdeJsonFlexible(cand)
                  : parseDesdeTexto(txt);
              }
            } catch {
              parsed = parseDesdeTexto(txt);
            }
          } else {
            parsed = parseDesdeTexto(txt);
          }
        } else if (ev?.contenido && typeof ev.contenido === "object") {
          const cand =
            ev.contenido?.preguntas ??
            ev.contenido?.data?.preguntas ??
            ev.contenido?.cuestionario?.preguntas ??
            ev.contenido?.estructura?.preguntas ??
            ev.contenido?.items ??
            (Array.isArray(ev.contenido) ? ev.contenido : null);

          if (Array.isArray(cand)) {
            parsed = parseDesdeJsonFlexible(cand);
          }
        }

        setPreguntas(parsed);
      } catch (e) {
        console.error("Error cargando evaluación:", e);
        setEvaluacion(null);
        setPreguntas([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluacion();
  }, [moduloIdFromUrl]);

  // ---------- Enviar ----------
  const onSubmit = async () => {
    if (!codigo.trim()) {
      alert("Por favor completa el código del estudiante.");
      return;
    }
    if (!evaluacion) {
      alert("No hay evaluación cargada.");
      return;
    }

    // Arma arreglo con lo que marcó el estudiante
    const respuestasMarcadas = preguntas.map((p) => ({
      preguntaId: p.numero,
      opcion: (respuestas[p.numero] ?? "") as "A" | "B" | "C" | "D",
    }));

    // ¿Podemos autocorregir en el front? (todas con 'correcta')
    const puedeAutocorregir = preguntas.every(
      (p) => typeof p.correcta !== "undefined"
    );

    try {
      if (puedeAutocorregir) {
        // Calificación local
        const detalle = preguntas.map((p) => {
          const marcada = respuestas[p.numero];
          const correcta = p.correcta!;
          const esCorrecta = !!marcada && marcada === correcta;
          return {
            numero: p.numero,
            enunciado: p.enunciado,
            marcada,
            correcta,
            esCorrecta,
          };
        });

        const correctas = detalle.filter((d) => d.esCorrecta).length;

        setResultado({
          correctas,
          total: preguntas.length,
          porcentaje: Math.round((correctas / preguntas.length) * 100),
          mensaje: "Respuestas enviadas.",
          detalle,
          payload: respuestasMarcadas,
        });
      } else {
        alert(
          "No se pudo autocorregir porque faltan soluciones en las preguntas."
        );
      }
    } catch (error) {
      alert("❌ Error al enviar la evaluación.");
      console.error(error);
    }
  };

  if (loading) return <p>Cargando evaluación...</p>;
  if (!evaluacion || total === 0)
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="bg-slate-800 rounded-xl p-4">
          No se encontró la evaluación.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold">Evaluación</h2>
        <p className="opacity-80 text-sm">
          Carrera: {carrera} — Jornada: {jornada} — Módulo: {modulo}
        </p>
      </header>

      {resultado ? (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-2">Resultado Final</h3>
          <p className="text-sm opacity-80 mb-4">
            Correctas: {resultado.correctas} / {resultado.total} (
            {resultado.porcentaje}%)
          </p>
          <div
            className={`p-3 rounded-lg text-black font-semibold mb-4 ${
              resultado.porcentaje >= 80
                ? "bg-green-400"
                : resultado.porcentaje >= 60
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
          >
            {resultado.mensaje}
          </div>

          {Array.isArray(resultado?.detalle) && resultado.detalle.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="font-semibold">Detalle de respuestas</h4>
              <ul className="space-y-2">
                {resultado.detalle.map((d: any) => (
                  <li
                    key={d.numero}
                    className={`rounded-lg p-3 text-sm ${
                      d.esCorrecta
                        ? "bg-green-900/30 border border-green-700/40"
                        : "bg-red-900/30 border border-red-700/40"
                    }`}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <span
                        className={`inline-block w-5 text-center font-bold ${
                          d.esCorrecta ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {d.esCorrecta ? "✓" : "✗"}
                      </span>
                      <span>Pregunta {d.numero}</span>
                    </div>
                    <div className="opacity-90 mt-1">{d.enunciado}</div>
                    <div className="mt-1">
                      <span className="opacity-70">Marcada:</span>{" "}
                      <span className="font-semibold">
                        {d.marcada ?? "—"}
                      </span>
                      {!d.esCorrecta && (
                        <>
                          {" • "}
                          <span className="opacity-70">Correcta:</span>{" "}
                          <span className="font-semibold">{d.correcta}</span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setResultado(null);
              setIdx(0);
            }}
            className="mt-4 rounded-xl bg-cyan-400 text-black px-4 py-2 font-semibold hover:opacity-90"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between text-sm opacity-80 mb-2">
              <span>
                Pregunta {idx + 1} de {total}
              </span>
              <span>{Math.round(((idx + 1) / total) * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-3 bg-cyan-400 rounded-full transition-all"
                style={{ width: `${((idx + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          <label className="block">
            <span className="text-sm opacity-90">Código del estudiante</span>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/60"
            />
          </label>

          <div className="bg-slate-800 p-5 rounded-2xl shadow-sm">
            <p className="font-semibold mb-4 leading-relaxed">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-400 text-black font-bold mr-2">
                {actual.numero}
              </span>
              {actual.enunciado}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {actual.opciones.map((opt) => {
                const selected = respuestas[actual.numero] === opt.letra;
                return (
                  <button
                    key={opt.letra}
                    onClick={() =>
                      setRespuestas((p) => ({
                        ...p,
                        [actual.numero]: opt.letra,
                      }))
                    }
                    className={`group rounded-xl text-left px-4 py-3 transition border
                    ${
                      selected
                        ? "bg-cyan-400/90 text-black border-cyan-300"
                        : "bg-slate-700/70 hover:bg-slate-700 border-slate-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold
                        ${
                          selected ? "bg-black/20" : "bg-slate-600 text-white"
                        }`}
                      >
                        {opt.letra}
                      </span>
                      <span className="leading-relaxed">{opt.texto}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                className={`rounded-xl px-4 py-2 font-semibold transition
                  ${
                    idx === 0
                      ? "bg-slate-700/60 cursor-not-allowed"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
              >
                Anterior
              </button>

              {idx < total - 1 ? (
                <button
                  onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
                  disabled={!respuestas[actual.numero]}
                  className={`rounded-xl px-4 py-2 font-semibold transition
                    ${
                      respuestas[actual.numero]
                        ? "bg-cyan-400 text-black hover:opacity-90"
                        : "bg-slate-700/60 cursor-not-allowed"
                    }`}
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  disabled={
                    !codigo.trim() ||
                    preguntas.some((p) => !respuestas[p.numero])
                  }
                  className={`rounded-xl px-4 py-2 font-semibold transition
                    ${
                      !codigo.trim() ||
                      preguntas.some((p) => !respuestas[p.numero])
                        ? "bg-slate-700/60 cursor-not-allowed"
                        : "bg-green-400 text-black hover:opacity-90"
                    }`}
                >
                  Enviar evaluación
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
