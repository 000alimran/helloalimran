import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Same /sitemap.xml URL that robots.txt points to. Lists every page, including new content.
export const GET: APIRoute = async ({ site }) => {
  const ventures = (await getCollection('projects', ({ data }) => data.group === 'venture')).sort((a, b) => a.data.order - b.data.order);
  const essays = await getCollection('writing');
  const studies = await getCollection('research');
  const paths = [
    '/', '/about/', '/work/', ...ventures.map((p) => `/work/${p.id}/`),
    '/research/', ...studies.map((r) => `/research/${r.id}/`),
    '/writing/', ...essays.map((e) => `/writing/${e.id}/`),
    '/now/', '/contact/',
  ];
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site)}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
