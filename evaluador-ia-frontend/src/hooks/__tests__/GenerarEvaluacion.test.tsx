import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenerarEvaluacion from '../../pages/GenerarEvaluacion';

// ✅ Usamos globalThis en lugar de global (TypeScript-friendly)
(globalThis as any).URL.createObjectURL = jest.fn(() => 'blob:mock-url');
(globalThis as any).URL.revokeObjectURL = jest.fn();

describe('GenerarEvaluacion Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar el formulario correctamente', () => {
    render(<GenerarEvaluacion />);
    
    expect(screen.getByText('Generar evaluación con IA')).toBeInTheDocument();
    expect(screen.getByText(/sube tu PDF/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /seleccionar PDF/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generar preguntas con IA/i })).toBeInTheDocument();
  });

  test('botón generar debe estar deshabilitado sin archivo', () => {
    render(<GenerarEvaluacion />);
    
    const generateBtn = screen.getByRole('button', { name: /generar preguntas con IA/i });
    expect(generateBtn).toBeDisabled();
  });

  test('debe permitir seleccionar archivo PDF', async () => {
    const user = userEvent.setup();
    render(<GenerarEvaluacion />);
    
    const pdfFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    expect(fileInput).toBeInTheDocument();
    
    await user.upload(fileInput, pdfFile);

    await waitFor(() => {
      expect(screen.getByText('PDF seleccionado')).toBeInTheDocument();
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
    
    const generateBtn = screen.getByRole('button', { name: /generar preguntas con IA/i });
    expect(generateBtn).not.toBeDisabled();
  });

  test('debe rechazar archivos que no sean PDF', async () => {
    const _user = userEvent.setup();
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<GenerarEvaluacion />);
    
    const txtFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, 'files', {
      value: [txtFile],
      writable: false,
    });
    
    const changeEvent = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(changeEvent);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Solo se permiten archivos PDF 🙏');
    });
    
    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    alertMock.mockRestore();
  });

  test('debe mostrar vista previa del PDF', async () => {
    const user = userEvent.setup();
    render(<GenerarEvaluacion />);
    
    const pdfFile = new File(['%PDF-1.4 content'], 'evaluacion.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(fileInput, pdfFile);

    await waitFor(() => {
      expect(screen.getByText('Vista previa:')).toBeInTheDocument();
      const iframe = screen.getByTitle('Vista previa PDF');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'blob:mock-url');
    });
  });

  test('debe permitir clic en zona de drop para seleccionar archivo', async () => {
    const user = userEvent.setup();
    render(<GenerarEvaluacion />);
    
    const dropZone = screen.getByText(/haz clic para seleccionar tu PDF/i).closest('div');
    expect(dropZone).toBeInTheDocument();
    
    await user.click(dropZone!);
    
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  test('botón generar debe estar habilitado solo con PDF válido', async () => {
    const user = userEvent.setup();
    render(<GenerarEvaluacion />);
    
    let generateBtn = screen.getByRole('button', { name: /generar preguntas con IA/i });
    expect(generateBtn).toBeDisabled();
    expect(generateBtn).toHaveClass('cursor-not-allowed');
    
    const pdfFile = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, pdfFile);

    await waitFor(() => {
      generateBtn = screen.getByRole('button', { name: /generar preguntas con IA/i });
      expect(generateBtn).not.toBeDisabled();
      expect(generateBtn).not.toHaveClass('cursor-not-allowed');
    });
  });

  test('debe aceptar solo archivos PDF en el input', () => {
    render(<GenerarEvaluacion />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toHaveAttribute('accept', 'application/pdf');
  });
});
