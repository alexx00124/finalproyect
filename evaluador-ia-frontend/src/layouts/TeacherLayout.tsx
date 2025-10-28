// src/layouts/TeacherLayout.tsx

import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function TeacherLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-cyan-400">
            Panel Docente
          </h1>
          <p className="text-xs text-slate-400 leading-tight break-all">
            {user?.email ?? "docente@admin.com"}
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-2 text-sm font-medium">
          <Link
            to="/docente"
            className="block rounded-xl px-3 py-2 bg-slate-700/40 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-600 hover:border-cyan-400 transition"
          >
            🏠 Panel general
          </Link>

          <Link
            to="/docente/generar"
            className="block rounded-xl px-3 py-2 bg-slate-700/40 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-600 hover:border-cyan-400 transition"
          >
            📄 Generar evaluación IA
          </Link>

          <Link
            to="/docente/evaluaciones"
            className="block rounded-xl px-3 py-2 bg-slate-700/40 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-600 hover:border-cyan-400 transition"
          >
            📚 Banco de evaluaciones
          </Link>

          <Link
            to="/docente/perfil"
            className="block rounded-xl px-3 py-2 bg-slate-700/40 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-600 hover:border-cyan-400 transition"
          >
            👤 Perfil docente
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-6 text-left rounded-lg px-3 py-2 text-sm font-semibold bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 border border-red-700 transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-slate-900">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Bienvenido, {user?.email ?? "Docente"}
            </h2>
            <p className="text-sm text-slate-400">
              Gestión de evaluaciones y generación con IA
            </p>
          </div>
        </header>

        <section className="bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl p-6 min-h-[60vh]">
          {/* Aquí va el contenido dinámico (DashboardDocente, GenerarEvaluacion, etc.) */}
          <Outlet />
        </section>
      </main>
    </div>
  );
}
