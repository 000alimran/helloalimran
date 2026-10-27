# helloalimran.com

Al Imran's monochrome editorial personal website. Static HTML/CSS/JS on Cloudflare Workers Static Assets.

## Structure

- `public/index.html`: homepage
- `public/about/`: biography and interactive timeline
- `public/work/`: selected ventures and clearly attributed initiatives
- `public/research/`: research interests and explicitly unpublished study proposal
- `public/writing/`: editorial essays
- `public/now/`: current interests
- `public/contact/`: verified professional contact
- `public/styles.css`: black-and-white responsive design system
- `public/site.js`: mobile menu, filters, reading progress

## Deploy (Cloudflare Workers)

- Git branch: `main`
- Build command: leave blank
- Deploy command: `npx wrangler deploy`
- Assets directory: `./public` via `wrangler.jsonc`

No framework or paid CMS is required. All deployed links are static paths. Third-party project sites linked externally may need their own availability checks. Content explicitly distinguishes project concepts from published academic work and credits Caira Foundation's founder, Kazi Sabiha.

## Editorial safety

Do not publish invented research results, journal acceptances, client performance metrics, impact numbers or credentials. Keep the project/role attribution accurate, and update the dates on new content.
