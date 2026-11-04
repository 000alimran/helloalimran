import { defineConfig } from 'astro/config';

// Keystatic's admin panel (/keystatic) only runs under `npm run dev`. The production build
// stays fully static, with no React or server code shipped to visitors.
const isDev = process.argv.includes('dev');
const devIntegrations = isDev
  ? [(await import('@astrojs/react')).default(), (await import('@keystatic/astro')).default()]
  : [];

export default defineConfig({
  site: 'https://helloalimran.com',
  // Keystatic's API routes have no trailing slash, so only enforce it in the build.
  trailingSlash: isDev ? 'ignore' : 'always',
  integrations: devIntegrations,
});
