import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: mode === 'production' ? '/speaker-placement-log/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5181,
    strictPort: true,
  },
}));
