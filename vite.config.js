import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { webfontDownload } from 'vite-plugin-webfont-dl';

export default defineConfig({
  plugins: [
    react(),
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap',
    ]),
  ],
  optimizeDeps: {
    include: ['redux-thunk'], // Ensure redux-thunk is included
    esbuildOptions: {
      resolveExtensions: ['.js', '.ts'], // Ensure Vite resolves JavaScript files properly
    },
  },
  server: {
    historyApiFallback: true, // This ensures all routes go to index.html
  },
});
 