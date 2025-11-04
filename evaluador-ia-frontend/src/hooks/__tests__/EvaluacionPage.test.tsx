// src/pages/__tests__/EvaluacionPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import EvaluacionPage from '../../pages/EvaluacionPage';

// Mock de useSearchParams
const mockSearchParams = new URLSearchParams('carrera=ing-software&jornada=diurna&modulo=1');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [mockSearchParams],
}));

// Mock de fetch
globalThis.fetch = jest.fn();

const mockEvaluacionJson = {
  id: 'eval-123',
  titulo: 'Evaluación Módulo 1',
  contenido: JSON.stringify([
    {
      numero: 1,
      enunciado: '¿Qué es JavaScript?',
      opciones: [
        { letra: 'A', texto: 'Un lenguaje de programación' },
        { letra: 'B', texto: 'Una base de datos' },
        { letra: 'C', texto: 'Un servidor' },
        { letra: 'D', texto: 'Un editor de texto' }
      ],
      correcta: 'A'
    },
    {
      numero: 2,
      enunciado: '¿Qué es React?',
      opciones: [
        { letra: 'A', texto: 'Un framework de CSS' },
        { letra: 'B', texto: 'Una librería de JavaScript' },
        { letra: 'C', texto: 'Un lenguaje de programación' },
        { letra: 'D', texto: 'Un sistema operativo' }
      ],
      correcta: 'B'
    }
  ])
};

const mockEvaluacionTexto = {
  id: 'eval-456',
  titulo: 'Evaluación de Texto',
  contenido: `
1. ¿Qué es Python?
A) Un lenguaje de programación
B) Una serpiente
C) Un navegador
D) Un editor

✅ Respuesta correcta: A

2. ¿Qué es HTML?
A) Un lenguaje de programación
B) Un lenguaje de marcado
C) Una base de datos
D) Un framework

Respuesta correcta: B
  `
};

const renderEvaluacionPage = () => {
  return render(
    <BrowserRouter>
      <EvaluacionPage />
    </BrowserRouter>
  );
};

describe('EvaluacionPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe mostrar loading inicialmente', () => {
    (globalThis.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderEvaluacionPage();
    
    expect(screen.getByText('Cargando evaluación...')).toBeInTheDocument();
  });

  test('debe cargar y mostrar evaluación en formato JSON', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEvaluacionJson]
    });

    renderEvaluacionPage();

    await waitFor(() => {
      expect(screen.getByText('¿Qué es JavaScript?')).toBeInTheDocument();
    });

    expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument();
    expect(screen.getByText('Un lenguaje de programación')).toBeInTheDocument();
  });

  test('debe cargar y parsear evaluación en formato texto', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEvaluacionTexto]
    });

    renderEvaluacionPage();

    await waitFor(() => {
      expect(screen.getByText('¿Qué es Python?')).toBeInTheDocument();
    });
  });

  test('debe permitir seleccionar respuestas', async () => {
    const user = userEvent.setup();
    
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEvaluacionJson]
    });

    renderEvaluacionPage();

    await waitFor(() => {
      expect(screen.getByText('¿Qué es JavaScript?')).toBeInTheDocument();
    });

    const opcionA = screen.getByText('Un lenguaje de programación').closest('button');
    expect(opcionA).toBeInTheDocument();
    
    await user.click(opcionA!);
    
    // Verifica que el botón "Siguiente" se habilite
    const siguienteBtn = screen.getByRole('button', { name: /siguiente/i });
    expect(siguienteBtn).not.toBeDisabled();
  });

  test('debe navegar entre preguntas', async () => {
    const user = userEvent.setup();
    
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEvaluacionJson]
    });

    renderEvaluacionPage();

    await waitFor(() => {
      expect(screen.getByText('¿Qué es JavaScript?')).toBeInTheDocument();
    });

    // Selecciona una opción
    const opcionA = screen.getByText('Un lenguaje de programación').closest('button');
    await user.click(opcionA!);

    // Ir a siguiente pregunta
    const siguienteBtn = screen.getByRole('button', { name: /siguiente/i });
    await user.click(siguienteBtn);

    // Verifica que muestre la segunda pregunta
    await waitFor(() => {
      expect(screen.getByText('¿Qué es React?')).toBeInTheDocument();
      expect(screen.getByText('Pregunta 2 de 2')).toBeInTheDocument();
    });

    // Botón anterior debe estar habilitado
    const anteriorBtn = screen.getByRole('button', { name: /anterior/i });
    expect(anteriorBtn).not.toBeDisabled();

    // Regresar
    await user.click(anteriorBtn);
    
    await waitFor(() => {
      expect(screen.getByText('¿Qué es JavaScript?')).toBeInTheDocument();
    });
  });

  test('debe validar código de estudiante antes de enviar', async () => {
    const user = userEvent.setup();
    
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEvaluacionJson]
    });

    renderEvaluacionPage();

    await waitFor(() => {
      expect(screen.getByText('¿Qué es JavaScript?')).toBeInTheDocument();
    });

    // Sin código, el botón final debe estar deshabilitado
    // Navega hasta la última pregunta
    const opcionA1 = screen.getByText('Un lenguaje de programación').closest('button');
    await user.click(opcionA1!);
    
    const siguienteBtn = screen.getByRole('button', { name: /siguiente/i });
    await user.click(siguienteBtn);

    await waitFor(() => {
      expect(screen.getByText('¿Qué es React?')).toBeInTheDocument();
    });

    const opcionB2 = screen.getByText('Una librería de JavaScript').closest('button');
    await user.click(opcionB2!);

    // Botón enviar debe aparecer deshabilitado
    const enviarBtn = screen.getByRole('button', { name: /enviar evaluación/i });
    expect(enviarBtn).toBeDisabled();
  });

  test('debe calcular resultado correctamente', async () => {
    const user = userEvent.setup();
    
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockEvaluacionJson]
    });

    renderEvaluacionPage();

    await waitFor(() => {
      expect(screen.getByText('¿Qué es JavaScript?')).toBeInTheDocument();
    });

    // Llenar código
    const codigoInput = screen.getByLabelText(/código del estudiante/i);
    await user.type(codigoInput, 'EST-001');

    // Responder pregunta 1 correctamente
    const opcionA1 = screen.getByText('Un lenguaje de programación').closest('button');
    await user.click(opcionA1!);
    
    await user.click(screen.getByRole('button', { name: /siguiente/i }));

    await waitFor(() => {
      expect(screen.getByText('¿Qué es React?')).toBeInTheDocument();
    });

    // Responder pregunta 2 correctamente
    const opcionB2 = screen.getByText('Una librería de JavaScript').closest('button');
    await user.click(opcionB2!);

    // Enviar
    const enviarBtn = screen.getByRole('button', { name: /enviar evaluación/i });
    await user.click(enviarBtn);

    // Verificar resultado
    await waitFor(() => {
      expect(screen.getByText('Resultado Final')).toBeInTheDocument();
      expect(screen.getByText(/Correctas: 2 \/ 2/)).toBeInTheDocument();
      expect(screen.getByText(/100%/)).toBeInTheDocument();
    });
  });

  test('debe mostrar mensaje si no hay evaluación', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderEvaluacionPage();

    await waitFor(() => {
      expect(screen.getByText('No se encontró la evaluación.')).toBeInTheDocument();
    });
  });

  test('debe manejar error de carga', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderEvaluacionPage();

    await waitFor(() => {
      expect(screen.getByText('No se encontró la evaluación.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});