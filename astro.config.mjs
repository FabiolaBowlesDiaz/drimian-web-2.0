// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// For GitHub Pages preview: site + base must match the repo name
// Change back to 'https://drimian.com' with no base for production (Cloudflare)
export default defineConfig({
  output: 'static',
  site: 'https://fabiolabowlesdiaz.github.io',
  base: '/drimian-web-2.0/',
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
