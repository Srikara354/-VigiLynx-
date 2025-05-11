import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000', 
          changeOrigin: true,
        },
      },
    },
    root: path.resolve(__dirname),
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    define: {
      // Make environment variables available to the client
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || ''),
      'import.meta.env.MODE': JSON.stringify(mode)
    }
  };
});