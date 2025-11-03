// src/pages/JornadaSelect.tsx
import { useNavigate, useParams } from 'react-router-dom';

type Jornada = 'diurna' | 'nocturna';

function CardButton({
  emoji,
  title,
  subtitle,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        group relative overflow-hidden rounded-2xl
        bg-slate-700/60 hover:bg-slate-700
        ring-1 ring-white/10 hover:ring-cyan-400/50
        px-6 py-8 text-left shadow-lg hover:shadow-xl
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
      "
    >
      {/* glow */}
      <span
        className="
          pointer-events-none absolute -inset-8 -z-10 opacity-0
          bg-gradient-to-tr from-cyan-500/20 via-teal-400/10 to-transparent
          blur-2xl transition-opacity duration-300
          group-hover:opacity-100
        "
      />
      <div className="flex items-center gap-4">
        <div
          className="
            grid h-12 w-12 place-items-center rounded-xl
            bg-slate-800 text-2xl
            ring-1 ring-white/10
          "
        >
          {emoji}
        </div>
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-slate-300/80">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}

export default function JornadaSelect() {
  const navigate = useNavigate();
  const { carreraId } = useParams();

  const go = (jornada: Jornada) => {
    navigate(`/carreras/${carreraId}/jornada/${jornada}/modulos`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-center text-xl font-bold">Selecciona tu jornada</h1>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <CardButton
          emoji="☀️"
          title="Diurna"
          subtitle="Lunes a viernes, horario diurno"
          onClick={() => go('diurna')}
        />
        <CardButton
          emoji="🌙"
          title="Nocturna"
          subtitle="Lunes a viernes, horario nocturno"
          onClick={() => go('nocturna')}
        />
      </div>
    </div>
  );
}
