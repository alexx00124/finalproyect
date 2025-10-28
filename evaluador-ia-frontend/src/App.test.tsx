import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('debería renderizar la página de login inicialmente', () => {
    render(<App />);

    const loginTitle = screen.getByText(/Iniciar Sesión/i);
    expect(loginTitle).toBeInTheDocument();
  });
});
