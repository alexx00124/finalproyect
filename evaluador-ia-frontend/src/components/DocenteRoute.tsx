// src/components/DocenteRoute.tsx
import { Navigate } from "react-router-dom";

export default function DocenteRoute({ children }: { children: React.ReactNode }) {
  const rawToken = localStorage.getItem("auth_token");
  const rawUser = localStorage.getItem("auth_user");

  // 1. Sin token => no autenticado
  if (!rawToken || !rawUser) {
    return <Navigate to="/login" replace />;
  }

  let user: { rol?: string } = {};
  try {
    user = JSON.parse(rawUser);
  } catch {
    // si user está corrupto en storage, mándalo a login para limpiar
    return <Navigate to="/login" replace />;
  }

  const esDocente = user.rol === "docente" || user.rol === "admin";

  // 2. No tiene permiso docente => mándalo al flujo estudiante
  if (!esDocente) {
    return <Navigate to="/carreras" replace />;
  }

  // 3. Tiene permiso docente => deja pasar
  return <>{children}</>;
}
