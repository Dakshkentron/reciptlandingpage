import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * Runs the functions in `api/` during `vite dev`.
 *
 * In production Vercel serves those files as edge functions; Vite knows nothing
 * about them and would answer `/api/admin/stats` with index.html, which the
 * console can only report as a broken response. This mounts each handler at its
 * own path so signing in works locally exactly as it does deployed.
 *
 * Development only — `apply: 'serve'` keeps it out of the build, and the
 * deployed site never loads this file.
 */
function apiRoutes(): Plugin {
  return {
    name: 'admin-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = new URL(req.url ?? '/', 'http://localhost').pathname;
        if (!path.startsWith('/api/')) return next();

        void (async () => {
          try {
            // The handlers are written against the Web platform, so the Node
            // request has to be rebuilt as a `Request` on the way in and the
            // `Response` unpacked on the way out.
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk as Buffer);
            const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

            const module = (await server.ssrLoadModule(`./api${path.slice(4)}.ts`)) as {
              default: (request: Request) => Promise<Response>;
            };

            const response = await module.default(
              new Request(`http://localhost${req.url}`, {
                method: req.method,
                headers: req.headers as Record<string, string>,
                body,
              }),
            );

            res.statusCode = response.status;
            response.headers.forEach((value, key) => res.setHeader(key, value));
            res.end(Buffer.from(await response.arrayBuffer()));
          } catch (cause) {
            server.config.logger.error(`[api] ${path} failed: ${String(cause)}`);
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ error: 'The local API route threw. See the terminal.' }));
          }
        })();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiRoutes()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
