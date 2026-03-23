// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  output: 'static',
  site: isGitHubPages ? 'https://fabiolabowlesdiaz.github.io' : 'https://drimian.com',
  base: isGitHubPages ? '/drimian-web-2.0/' : '/',
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
