import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Every public page is prerendered to static HTML. Only Keystatic's admin (/keystatic, /api/keystatic)
// runs as on-demand Worker code in production. `npm run dev` stays on Node without the adapter so
// Keystatic's local mode can write files to disk.
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://helloalimran.com',
  // Keystatic's API routes have no trailing slash; Cloudflare adds it for the static pages.
  trailingSlash: 'ignore',
  integrations: [react(), keystatic()],
  // No Astro sessions or image processing, so the adapter doesn't add KV or Images bindings.
  session: false,
  adapter: isDev ? undefined : cloudflare({ imageService: 'passthrough', imagesBindingName: false }),
});
