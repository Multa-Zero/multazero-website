import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Multi-page: sem estas entradas o build só emitiria a LP e /sobre e /planos
// sumiriam do dist/. O blog Astro é buildado à parte por scripts/build-all.mjs.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        institucional: resolve(__dirname, 'institucional/index.html'),
        planos: resolve(__dirname, 'planos/index.html'),
        // redirect legado: /sobre/ -> /institucional/
        sobre: resolve(__dirname, 'sobre/index.html'),
      },
    },
  },
});
