import { useNavigate, useParams } from 'react-router-dom';

export default function JornadaSelect() {
  const navigate = useNavigate();
  const { carreraId } = useParams();

  const go = (jornada: 'diurna' | 'nocturna') => {
    navigate(`/carreras/${carreraId}/jornada/${jornada}/modulos`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Selecciona tu jornada</h1>
      <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
        <button onClick={() => go('diurna')}>Diurna</button>
        <button onClick={() => go('nocturna')}>Nocturna</button>
      </div>
    </div>
  );
}
