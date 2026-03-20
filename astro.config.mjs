// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://drimian.com',
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
