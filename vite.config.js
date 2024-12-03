import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['redux-thunk'], // Ensure redux-thunk is included
    esbuildOptions: {
      resolveExtensions: ['.js', '.ts'], // Ensure Vite resolves JavaScript files properly
    },
  },
});
