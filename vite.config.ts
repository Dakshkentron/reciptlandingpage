import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Tags every RUM event with the deploy it came from, so a regression can be
// traced back to a commit. Vercel exposes the SHA at build time; a local
// `npm run build` has no deploy to name.
const version = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local';

// Vercel runs the same production `vite build` for preview deploys, so
// `import.meta.env.PROD` cannot tell a preview from the live site. VERCEL_ENV
// can: 'production' | 'preview' | 'development'.
const deployEnv = process.env.VERCEL_ENV ?? 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __DEPLOY_ENV__: JSON.stringify(deployEnv),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
