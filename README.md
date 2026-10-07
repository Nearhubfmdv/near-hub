# NEAR — nearhub.net

Public website for NEAR / NearHub: what NEAR does, who leads it, and a way to get in touch.
A single page — Hero, About, Meet the Team, Engage NEAR, footer.

## Stack

- React 19 + Vite (JavaScript)
- Plain CSS with design tokens (`src/styles.css`)
- Framer Motion for restrained motion (loaded via `LazyMotion`; respects `prefers-reduced-motion`)
- Manrope from Google Fonts, with Inter/system fallbacks

No backend, router, UI kit, or CSS framework.

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server (http://localhost:5173)
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

Requires Node 20.19+ (Vite 8).

## Structure

```
index.html                 metadata, favicon links, hero image preload
public/                    favicon.ico, favicon-32.png, icon-192.png, apple-touch-icon.png, og-image.jpg
public/images/             optimised web images (generated, committed)
src/content.js             all copy: nav, capabilities, leadership names/roles/bios, email
src/components/            Header, Hero, About, Leadership, Engage, ContactForm, Footer, …
src/styles.css             tokens, layout, components
images/assets/             original supplied assets (never modified)
scripts/optimize-images.py regenerates public/ images from images/assets
```

### Images

Originals live in `images/assets/`. Web versions in `public/` are produced by:

```bash
python3 -m pip install Pillow
python3 scripts/optimize-images.py
```

The script creates responsive WebP variants of `planet.webp` (hero) and `screen.webp` (About),
4:5 portrait crops of the leadership photos (crop boxes are defined per person in the script),
a transparent white NEAR wordmark from `NEAR_logo_dark_high_quality.png`, favicons from the
circular symbol in `NEAR_logo_light_high_quality.png`, and the 1200×630 Open Graph image.

Portrait mapping: `Fransisco.png` → Francisco Martinez de Velasco (CEO / Founder);
`FransiscoCortina.png` → Francisco Martinez de Velasco Cortina (BOD / Director) — two different
people; `Luis.png`, `Roger.png`, `Dean.png` → Luis Sayeg Seade, Roger Ingles, Dr. Dean Barker.

`images/old website mockups/` holds screenshots of the previous site for reference only and is
git-ignored.

## Contact form

The form POSTs JSON to the URL in `VITE_CONTACT_FORM_ENDPOINT`:

```json
{ "name": "…", "email": "…", "phone": "…", "message": "…" }
```

with `Content-Type: application/json` and `Accept: application/json`. Any 2xx response is shown
as success; anything else (or a 15 s timeout) shows an error that points visitors to
info@nearhub.net. Nothing is ever reported as sent unless the endpoint returns 2xx.

**If the variable is not set**, the form still validates, but on submit it tells the visitor that
online inquiries are not connected and asks them to email info@nearhub.net. It does not pretend
to send.

### Connecting it

1. Create an endpoint that accepts the JSON above and forwards it to info@nearhub.net — for
   example a Formspree / Basin / Getform form, or your own serverless function. It must allow
   CORS from the site origin.
2. Set the variable at build time (it is inlined into the client bundle, so it must be a public
   URL — never put API keys or secrets in a `VITE_` variable):
   ```bash
   cp .env.example .env.local   # for local testing
   # VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
   ```
   On a host (Netlify, Vercel, Cloudflare Pages, …) add `VITE_CONTACT_FORM_ENDPOINT` to the
   project's build environment variables, then rebuild.
3. Submit a test inquiry on the deployed site and confirm it arrives.

## Deployment

Static site: deploy the `dist/` folder from `npm run build` to any static host.

- Build command `npm run build`, output directory `dist`.
- Set `VITE_CONTACT_FORM_ENDPOINT` in the build environment (see above).
- Canonical URL and Open Graph URLs point to `https://nearhub.net/`; update `index.html` if the
  production domain differs.
- Serve over HTTPS and point the `nearhub.net` DNS at the host.
