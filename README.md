# Hello Al Imran

A personal website for Al Imran: design, technology, work, research interests, and writing.

## Deployment

This is a **static, no-build site**, designed for Cloudflare Workers Static Assets.

- Cloudflare Worker name: `helloalimran`
- Build command: **leave blank**
- Deploy command: `npx wrangler deploy`
- Asset directory: `public/` (defined in `wrangler.jsonc`)

Edit `public/index.html` and `public/styles.css` to change the site. Publishing research or writing will require adding actual content and verifying publication status. This starter does not claim any academic publications.
