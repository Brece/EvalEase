import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

import dotenv from 'dotenv';
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, 'src/frontend'), // Where the index.html and main.tsx files are located
  publicDir: path.resolve(__dirname, 'src/frontend/app/public'), // Set custom public directory
  plugins: [
    react(),
    // Inject environment variables into the frontend
    createHtmlPlugin({
      inject: {
        data: Object.fromEntries(
          Object.entries(process.env).filter(([key]) =>
            key.startsWith('VITE_'),
          ),
        ),
      },
    }),
  ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/frontend/app'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true, // Automatically clean the output directory before building
  },
  define: {
    'process.env': process.env, // Make .env variables available to the frontend
  },
  server: {
    proxy: {
      '/api': process.env.SERVER_URL || 'http://localhost:8080', // Proxy API calls to the backend
    },
  },
});
