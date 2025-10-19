import { Outlet, NavLink } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-white grid grid-cols-[220px_1fr]">
      <aside className="bg-slate-800 p-4">
        <h1 className="text-xl font-bold mb-6">Evaluador IA</h1>
        <nav className="space-y-2">
          <NavLink to="/" className={({isActive}) =>
            `block rounded px-3 py-2 ${isActive ? 'bg-cyan-400 text-black' : 'hover:bg-slate-700'}`}>
            Carrera
          </NavLink>
          <NavLink to="/modulos" className={({isActive}) =>
            `block rounded px-3 py-2 ${isActive ? 'bg-cyan-400 text-black' : 'hover:bg-slate-700'}`}>
            Módulos
          </NavLink>
          <NavLink to="/materias" className={({isActive}) =>
            `block rounded px-3 py-2 ${isActive ? 'bg-cyan-400 text-black' : 'hover:bg-slate-700'}`}>
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
