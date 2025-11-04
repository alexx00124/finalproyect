// src/setupTests.ts
import '@testing-library/jest-dom';
// @ts-ignore
import { TextEncoder, TextDecoder } from 'util';

// Declaramos global explícitamente para TypeScript
declare const global: typeof globalThis;

// Mock de TextEncoder/TextDecoder (necesario para React Router v7)
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;

// Mock de import.meta.env - ACTUALIZADO
(global as any).importMeta = {
  env: {
    VITE_API_URL: 'http://localhost:3000',
  },
};

// También definir en process.env para compatibilidad
process.env.VITE_API_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});