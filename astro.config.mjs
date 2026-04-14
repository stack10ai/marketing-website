// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://stack10.ai',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), tailwind(), sitemap()],
});
