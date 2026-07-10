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

To enable Amazon Associates tagging for affiliate product links, set:

- `NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG`

Do not commit the Associates tag to source code. Because this is a `NEXT_PUBLIC_` variable, set it before running `npm run build`; Next.js inlines public environment values at build time.

### Verification Checklist

- [ ] Ensure the script loads in production builds when variables are set.
- [ ] Confirm no analytics script is loaded in development builds.
- [ ] Ensure variables use the `NEXT_PUBLIC_` prefix to work on the client side.
- [ ] Verify Umami automatic page view tracking works.
- [ ] Ensure no personal data is collected in custom events.
- [ ] Confirm Amazon affiliate links include the configured `tag` query parameter in production.

## Content Editing

- Products: `data/products.json`
- Supplements: `data/supplements.json`
- Diet plans: `data/dietPlans.json`
- Foods: `data/foods.json`
- Ingredients: `data/ingredients.json`
- Affiliate products: `data/affiliateProducts.json`
- Guides: `content/guides/*.mdx`

Keep the existing data shapes stable. Add fields intentionally and update the corresponding TypeScript types in `src/lib/types.ts`.

Affiliate products support `id`, `title`, `category`, `shortDescription`, `imageUrl` or `imagePath`, `amazonUrl`, `tags`, and optional `priceText` and `notes`. Use tags such as guide slugs, product slugs, supplement slugs, or broad categories to place products in relevant sections. The reusable affiliate section adds the Amazon Associates tag from `NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG`, opens Amazon links in a new tab, and tracks Umami `Outbound Product Click` events with non-personal product/source metadata.

Every page or component that shows affiliate products or links must include the disclosure near the links: “As an Amazon Associate, we may earn from qualifying purchases.”

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
