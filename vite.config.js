import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { webfontDownload } from 'vite-plugin-webfont-dl';
import wasm from 'vite-plugin-wasm'; // Add this line

export default defineConfig({
  plugins: [
    react(),
    webfontDownload([
      'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap', // Add Inter font
    ]),
    wasm(), // Add this line
  ],
  optimizeDeps: {
    include: ['redux-thunk'], // Ensure redux-thunk is included
    exclude: ['@ffmpeg/ffmpeg'], // Exclude ffmpeg from optimization
    esbuildOptions: {
      resolveExtensions: ['.js', '.ts'], // Ensure Vite resolves JavaScript files properly
    },
  },
  server: {
    historyApiFallback: true, // This ensures all routes go to index.html
  },
  define: {
    global: 'window', // Polyfill global as window object for browser environment
  },
});