import { useNavigate } from 'react-router-dom';

export default function CarreraSelect() {
  const nav = useNavigate();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Selecciona tu carrera</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => nav('/modulos?carrera=ing-software')}
          className="rounded-xl bg-cyan-400 text-black px-4 py-6 font-semibold hover:opacity-90"
        >
          Ingeniería de Software
        </button>
        <button
          onClick={() => nav('/modulos?carrera=ind-sistemas')}
          className="rounded-xl bg-lime-500 text-black px-4 py-6 font-semibold hover:opacity-90"
        >
          Ingeniería Industrial de Sistemas
        </button>
      </div>
      <p className="text-sm opacity-80">
        MVP activo: <b>Ing. de Software → Módulo 1 → Programación 1</b>.
      </p>
    </div>
  );
}
