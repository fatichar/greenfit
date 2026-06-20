# GreenFit MVP

Static-first nutrition guidance website for `greenfit.in`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Static JSON data in `data/`
- MDX-style guide files in `content/guides/`
- No backend, auth, database, CMS, payments, barcode scanning, or AI chatbot

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm start
```

By default, `npm start` runs the Next.js server on port `3000`.

## Environment Variables

No environment variables are required for local development.

To enable Umami analytics in production, set both:

- `NEXT_PUBLIC_UMAMI_SCRIPT_URL` (e.g., `https://eu.umami.is/script.js`)
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`

Analytics only load when `NODE_ENV=production` and both variables are present.

### Verification Checklist

- [ ] Ensure the script loads in production builds when variables are set.
- [ ] Confirm no analytics script is loaded in development builds.
- [ ] Ensure variables use the `NEXT_PUBLIC_` prefix to work on the client side.
- [ ] Verify Umami automatic page view tracking works.
- [ ] Ensure no personal data is collected in custom events.

## Content Editing

- Products: `data/products.json`
- Supplements: `data/supplements.json`
- Diet plans: `data/dietPlans.json`
- Foods: `data/foods.json`
- Ingredients: `data/ingredients.json`
- Guides: `content/guides/*.mdx`

Keep the existing data shapes stable. Add fields intentionally and update the corresponding TypeScript types in `src/lib/types.ts`.

## VPS / Nginx Notes

1. Pull or upload the project to the VPS.
2. Install Node.js 20+.
3. Run:

```bash
npm install
npm run build
npm start
```

For a long-running process, use a process manager such as `pm2` or a `systemd` service:

```bash
pm2 start npm --name greenfit -- start
pm2 save
```

Example Nginx reverse proxy:

```nginx
server {
  server_name greenfit.in www.greenfit.in;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Add TLS with Certbot or your preferred certificate workflow.

## Quality Checks

```bash
npm run lint
npm run build
```

The app statically generates the directory pages, detail pages, guides, sitemap, and robots file.
