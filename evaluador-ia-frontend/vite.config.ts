// vite.config.ts

import { defineConfig } from 'vitest/config'; // ✅ ¡LA CORRECCIÓN ESTÁ AQUÍ!
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ahora TypeScript entiende perfectamente esta sección
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});