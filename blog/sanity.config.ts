import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

// Studio is mounted by @sanity/astro at base ('/blog') + studioBasePath ('/studio').
export default defineConfig({
  name: 'default',
  title: 'MultaZero Blog',
  projectId: '57jbjtzh',
  dataset: 'production',
  basePath: '/blog/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
