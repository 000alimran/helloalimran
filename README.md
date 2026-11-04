# helloalimran.com

Al Imran's editorial personal website. Built with [Astro](https://astro.build) as a fully static site and served by Cloudflare Workers Static Assets. Content lives in Markdown files and can be edited in the browser with [Keystatic](https://keystatic.com).

## Editing content

Requires Node.js 22.23.4 or newer (`.nvmrc`).

```bash
npm install
npm run dev
```

- Site: http://localhost:4321/
- Admin panel: http://localhost:4321/keystatic/

Keystatic saves straight into `src/content/`. Commit and push to `main` and Cloudflare rebuilds the live site.

| What | Where | Shown on |
| --- | --- | --- |
| Projects | `src/content/projects/*.md` | Home and Work cards. `group: venture` also gets `/work/<slug>/`; `group: orbit` links out to its website |
| Writing | `src/content/writing/*.md` | Home (latest three), `/writing/`, `/writing/<slug>/` |
| Research | `src/content/research/*.md` | Home (first one), `/research/`, `/research/<slug>/` |

`order` sets the position on the Work page, `homeOrder` the position on the home page (leave it empty to keep a project off the home page). An orbit project without a `website` shows "website coming soon".

## Structure

- `src/pages/`: one file per page; `[slug].astro` files render the content collections
- `src/layouts/Base.astro`: shared `<head>`, header, footer and scripts
- `src/components/`: header, footer, contact block, project card
- `src/content.config.ts`: content schema; `keystatic.config.ts`: admin panel fields
- `public/`: copied as-is: `styles.css`, `site.js`, `js/` (GSAP, animations, paper cards), images, `_headers`, `robots.txt`
- `/sitemap.xml` is generated from the pages and collections

## Deploy (Cloudflare Workers)

- Git branch: `main`
- Deploy command: `npx wrangler deploy`
- `wrangler.jsonc` runs `npm run build` before deploying and uploads `./dist`

Keystatic only runs under `npm run dev`; the production build contains no React or server code.

## Editorial safety

Do not publish invented research results, journal acceptances, client performance metrics, impact numbers or credentials. Keep the project/role attribution accurate, and update the dates on new content.
