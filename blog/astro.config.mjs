// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://multazero.co',
  // Trailing slash obrigatória: o código monta URLs como `${BASE_URL}post/...`
  // e o Astro 5+ entrega BASE_URL exatamente como configurado aqui.
  base: '/blog/',
  integrations: [
    sanity({
      projectId: '57jbjtzh',
      dataset: 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react(),
  ],
});
