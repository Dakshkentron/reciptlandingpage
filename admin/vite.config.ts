import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// The console is its own app, deployed on its own domain. During development it
// still needs the serverless functions in `api/`, which only run on Vercel — use
// `vercel dev` rather than `vite dev` when you need to sign in for real.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
