// src/layouts/AppLayout.tsx
import { Outlet, NavLink, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AppLayout() {
  const [params] = useSearchParams();
  const { user, logout } = useAuth();

  // Valores por defecto para el MVP
  const carrera = params.get('carrera') ?? 'ing-software';
  const jornada = params.get('jornada') ?? 'diurna';
  const moduloPorDefecto = 1; // Sólo el módulo 1 habilitado

  const linkBase = 'block rounded px-3 py-2';
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${linkBase} ${isActive ? 'bg-cyan-400 text-black' : 'hover:bg-slate-700'}`;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar superior con info del usuario */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-white">Evaluador IA</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.nombre}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Layout con sidebar y contenido */}
      <div className="grid grid-cols-[220px_1fr] h-[calc(100vh-73px)]">
        <aside className="bg-slate-800 p-4 border-r border-slate-700">
          <h2 className="text-lg font-bold mb-6">Universitaria de Colombia</h2>
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

        <main className="bg-slate-800 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}