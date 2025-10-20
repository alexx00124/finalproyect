// src/layouts/AppLayout.tsx
import { Outlet, NavLink, useSearchParams } from 'react-router-dom';

export default function AppLayout() {
  const [params] = useSearchParams();

  // Valores por defecto para el MVP
  const carrera = params.get('carrera') ?? 'ing-software';
  const jornada = params.get('jornada') ?? 'diurna';
  const moduloPorDefecto = 1; // Sólo el módulo 1 habilitado

  const linkBase = 'block rounded px-3 py-2';
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${isActive ? 'bg-cyan-400 text-black' : 'hover:bg-slate-700'}`;

  return (
    <div className="min-h-screen bg-slate-900 text-white grid grid-cols-[220px_1fr]">
      <aside className="bg-slate-800 p-4">
        <h1 className="text-xl font-bold mb-6">Evaluador IA Universitaria de Colombia</h1>
        <nav className="space-y-2">
          {/* Mantiene la selección en el querystring */}
          <NavLink to={`/?carrera=${carrera}&jornada=${jornada}`} className={linkClass}>
            Carrera
          </NavLink>

          {/* Ruta real definida en el router */}
          <NavLink
            to={`/carreras/${carrera}/jornada/${jornada}/modulos`}
            className={linkClass}
          >
            Módulos
          </NavLink>

          {/* Apunta a las materias del módulo 1 (MVP) */}
          <NavLink
            to={`/modulos/${moduloPorDefecto}/materias?carrera=${carrera}&jornada=${jornada}`}
            className={linkClass}
          >
            Materias
          </NavLink>
        </nav>
      </aside>

      <main className="p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="text-2xl font-semibold">Panel</div>
          <div className="text-sm opacity-70">v0.1</div>
        </header>

        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
