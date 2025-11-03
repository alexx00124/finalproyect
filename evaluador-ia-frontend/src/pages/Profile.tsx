// src/pages/Profile.tsx
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Mi Perfil</h2>
      
      <div className="bg-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Información de tu cuenta</h3>
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-slate-600">
            <span className="text-slate-300">ID de usuario:</span>
            <span className="font-mono text-sm text-white">{user?.id}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-600">
            <span className="text-slate-300">Nombre:</span>
            <span className="font-medium text-white">{user?.nombre}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-slate-300">Email:</span>
            <span className="font-medium text-white">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}